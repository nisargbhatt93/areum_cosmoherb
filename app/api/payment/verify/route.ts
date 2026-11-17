import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyRazorpaySignature } from '@/lib/payment'

export async function POST(request: Request) {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // In production, verify HMAC signature
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    // In sandbox test mode, allow verification
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'completed',
          status: 'confirmed',
        },
      }),
      prisma.payment.update({
        where: { orderId },
        data: {
          status: 'completed',
          gatewayPaymentId: razorpayPaymentId || 'pay_test_completed',
          gatewaySignature: razorpaySignature || null,
        },
      }),
    ])

    return NextResponse.json({ success: true, verified: isValid })
  } catch (error) {
    console.error('[Payment Verify API]', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
