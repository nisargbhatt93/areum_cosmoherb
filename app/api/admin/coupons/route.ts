import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { couponSchema } from '@/lib/validators'

export async function GET() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ coupons })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = couponSchema.parse(body)

    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    })

    if (existing) {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description || null,
        type: data.type,
        value: data.value,
        maxDiscount: data.maxDiscount || null,
        minOrderAmount: data.minOrderAmount || 0,
        startDate: new Date(data.startDate),
        expiryDate: new Date(data.expiryDate),
        usageLimit: data.usageLimit || null,
        perCustomerLimit: data.perCustomerLimit || 1,
        isFirstOrderOnly: data.isFirstOrderOnly || false,
        isCodAllowed: data.isCodAllowed ?? true,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    console.error('[Admin Coupon Create API]', error)
    return NextResponse.json({ error: error.message || 'Failed to create coupon' }, { status: 400 })
  }
}
