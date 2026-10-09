import prisma from './db'

export interface CartItem {
  productId: string
  price: number
  mrp: number
  quantity: number
  categoryId?: string
}

export interface CouponValidationResult {
  valid: boolean
  discount: number
  message: string
  couponId?: string
}

export async function validateCoupon(
  code: string,
  cartItems: CartItem[],
  userId?: string
): Promise<CouponValidationResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase(), isActive: true },
    include: { products: true },
  })

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code.' }
  }

  const now = new Date()
  if (now < coupon.startDate) {
    return { valid: false, discount: 0, message: 'Coupon is not yet active.' }
  }
  if (now > coupon.expiryDate) {
    return { valid: false, discount: 0, message: 'Coupon has expired.' }
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: 'Coupon usage limit reached.' }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required.`,
    }
  }

  if (userId) {
    const usageCount = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId },
    })
    if (usageCount >= coupon.perCustomerLimit) {
      return { valid: false, discount: 0, message: 'You have already used this coupon.' }
    }

    if (coupon.isFirstOrderOnly) {
      const orderCount = await prisma.order.count({ where: { userId } })
      if (orderCount > 0) {
        return { valid: false, discount: 0, message: 'Coupon is valid for first orders only.' }
      }
    }
  }

  // Apply product restriction if any
  let eligibleSubtotal = subtotal
  if (coupon.products.length > 0) {
    const eligibleProductIds = coupon.products.map((p) => p.productId)
    eligibleSubtotal = cartItems
      .filter((item) => eligibleProductIds.includes(item.productId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
    if (eligibleSubtotal === 0) {
      return { valid: false, discount: 0, message: 'Coupon is not applicable to your cart items.' }
    }
  }

  let discount = 0
  if (coupon.type === 'percentage') {
    discount = (eligibleSubtotal * coupon.value) / 100
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount)
    }
  } else {
    discount = Math.min(coupon.value, eligibleSubtotal)
  }

  return {
    valid: true,
    discount: Math.round(discount * 100) / 100,
    message: `Coupon applied! You saved ₹${Math.round(discount)}.`,
    couponId: coupon.id,
  }
}

export function calculateShipping(
  subtotal: number,
  freeShippingThreshold: number = 999,
  baseShipping: number = 60
): number {
  if (subtotal >= freeShippingThreshold) return 0
  return baseShipping
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round((subtotal * taxRate) / 100 * 100) / 100
}

export function getOrderSummary(
  cartItems: CartItem[],
  discount: number,
  shippingFee: number,
  taxRate: number = 0
) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = calculateTax(subtotal - discount, taxRate)
  const total = subtotal - discount + shippingFee + tax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    shippingFee: Math.round(shippingFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
