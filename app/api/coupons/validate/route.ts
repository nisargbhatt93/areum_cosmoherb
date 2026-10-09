import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateCoupon } from '@/lib/promotion-engine'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    const body = await request.json()
    const { code, cartItems } = body

    if (!code || !cartItems) {
      return NextResponse.json({ error: 'Coupon code and cart items are required.' }, { status: 400 })
    }

    const result = await validateCoupon(code, cartItems, session?.user?.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Coupon Validate API]', error)
    return NextResponse.json({ error: 'Failed to validate coupon.' }, { status: 500 })
  }
}
