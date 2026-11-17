import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { safeJsonParse } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderNumber, query } = body // query is email or phone

    if (!orderNumber || !query) {
      return NextResponse.json({ error: 'Order number and phone/email are required.' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        shipment: true,
        payment: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'No order found with this order number.' }, { status: 404 })
    }

    // Verify ownership by checking email or phone in order or shippingAddress
    const address: any = safeJsonParse(order.shippingAddress, {})
    const cleanQuery = query.trim().toLowerCase()

    const matchesEmail =
      (order.guestEmail && order.guestEmail.toLowerCase() === cleanQuery) ||
      (address.email && address.email.toLowerCase() === cleanQuery)

    const matchesPhone =
      (order.guestPhone && order.guestPhone.includes(cleanQuery)) ||
      (address.phone && address.phone.includes(cleanQuery))

    // If user was logged in, check user table as well
    let matchesUser = false
    if (order.userId) {
      const user = await prisma.user.findUnique({ where: { id: order.userId } })
      if (user) {
        if (user.email.toLowerCase() === cleanQuery || (user.phone && user.phone.includes(cleanQuery))) {
          matchesUser = true
        }
      }
    }

    if (!matchesEmail && !matchesPhone && !matchesUser) {
      return NextResponse.json(
        { error: 'Verification failed. The contact details do not match this order number.' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      expectedDelivery: order.expectedDelivery,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shipment: order.shipment,
      items: order.items.map((i) => ({
        id: i.id,
        name: i.productName,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
        image: i.product?.images[0]?.url,
      })),
      address: {
        name: address.name,
        city: address.city,
        state: address.state,
      },
    })
  } catch (error) {
    console.error('[Track Order API]', error)
    return NextResponse.json({ error: 'Failed to retrieve order tracking details.' }, { status: 500 })
  }
}
