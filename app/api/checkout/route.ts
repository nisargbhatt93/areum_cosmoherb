import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/lib/auth'
import { generateOrderNumber, getEstimatedDelivery } from '@/lib/utils'
import { validateCoupon, calculateShipping, getOrderSummary } from '@/lib/promotion-engine'
import { createRazorpayOrder } from '@/lib/payment'
import { checkoutSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const session = await auth()
    const body = await request.json()

    // Validate input
    const checkoutData = checkoutSchema.parse(body)
    const { cartItems } = body

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
    }

    // 1. Validate all products server-side (NEVER trust client prices)
    const productIds = cartItems.map((item: { productId: string }) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products are no longer available.' },
        { status: 400 }
      )
    }

    // 2. Build validated cart with SERVER-SIDE prices
    const validatedCart = cartItems.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Product ${item.productId} not found`)
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }
      return {
        productId: product.id,
        price: product.price, // SERVER price, not client
        mrp: product.mrp,
        quantity: item.quantity,
        name: product.name,
        sku: product.sku,
        image: null,
      }
    })

    // 3. Validate coupon server-side
    let discount = 0
    let couponId: string | undefined
    let couponCode: string | undefined

    if (checkoutData.couponCode) {
      const couponResult = await validateCoupon(
        checkoutData.couponCode,
        validatedCart,
        session?.user?.id
      )
      if (couponResult.valid) {
        discount = couponResult.discount
        couponId = couponResult.couponId
        couponCode = checkoutData.couponCode.toUpperCase()
      }
    }

    // 4. Calculate shipping & totals
    const subtotal = validatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Get free shipping threshold from store settings
    const freeShippingThresholdSetting = await prisma.storeSettings.findUnique({
      where: { key: 'free_shipping_threshold' },
    })
    const freeShippingThreshold = parseFloat(
      freeShippingThresholdSetting?.value || '999'
    )

    const shippingFee =
      checkoutData.paymentMethod === 'cod'
        ? calculateShipping(subtotal - discount, freeShippingThreshold) + 40 // COD fee
        : calculateShipping(subtotal - discount, freeShippingThreshold)

    const summary = getOrderSummary(validatedCart, discount, shippingFee, 0)

    // 5. Create order in DB
    const shippingAddress = JSON.stringify({
      name: checkoutData.name,
      phone: checkoutData.phone,
      line1: checkoutData.line1,
      line2: checkoutData.line2,
      city: checkoutData.city,
      state: checkoutData.state,
      pincode: checkoutData.pincode,
      country: 'India',
    })

    const orderNumber = generateOrderNumber()
    const expectedDelivery = getEstimatedDelivery(5)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        guestName: !session?.user ? checkoutData.name : null,
        guestEmail: !session?.user ? checkoutData.email : null,
        guestPhone: !session?.user ? checkoutData.phone : null,
        shippingAddress,
        subtotal: summary.subtotal,
        discount: summary.discount,
        couponCode: couponCode || null,
        couponId: couponId || null,
        shippingFee: summary.shippingFee,
        tax: summary.tax,
        total: summary.total,
        paymentMethod: checkoutData.paymentMethod,
        paymentStatus: checkoutData.paymentMethod === 'cod' ? 'pending' : 'pending',
        status: 'pending',
        expectedDelivery,
        items: {
          create: validatedCart.map((item) => ({
            productId: item.productId,
            productName: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            mrp: item.mrp,
            discount: item.mrp - item.price,
            total: item.price * item.quantity,
          })),
        },
        payment: {
          create: {
            amount: summary.total,
            method: checkoutData.paymentMethod,
            status: 'pending',
          },
        },
        shipment: {
          create: {
            status: 'pending',
            estimatedDate: expectedDelivery,
          },
        },
      },
    })

    // 6. Reserve inventory
    for (const item of validatedCart) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
      await prisma.inventoryTransaction.create({
        data: {
          productId: item.productId,
          type: 'sale',
          quantity: -item.quantity,
          reason: 'Order placed',
          reference: orderNumber,
        },
      })
    }

    // 7. Update coupon usage
    if (couponId && session?.user?.id) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      })
      await prisma.couponUsage.create({
        data: { couponId, userId: session.user.id, orderId: order.id },
      })
    }

    // 8. For Razorpay — create gateway order
    let razorpayOrderId: string | null = null
    if (checkoutData.paymentMethod === 'razorpay') {
      try {
        const rzpOrder = await createRazorpayOrder(summary.total, order.id)
        razorpayOrderId = rzpOrder.id
        await prisma.payment.update({
          where: { orderId: order.id },
          data: { gatewayOrderId: rzpOrder.id },
        })
      } catch (err) {
        console.error('[Razorpay] Order creation failed:', err)
        // Sandbox mode: generate mock order ID
        razorpayOrderId = `mock_order_${order.id}`
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: summary.total,
      paymentMethod: checkoutData.paymentMethod,
      razorpayOrderId,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Insufficient stock')) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      if (error.name === 'ZodError') {
        return NextResponse.json({ error: 'Invalid checkout data.' }, { status: 400 })
      }
    }
    console.error('[Checkout API]', error)
    return NextResponse.json(
      { error: 'Checkout failed. Please try again.' },
      { status: 500 }
    )
  }
}
