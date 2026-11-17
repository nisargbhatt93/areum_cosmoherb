import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, data, userId, sessionId, device } = body

    if (!event) {
      return NextResponse.json({ error: 'Event name required' }, { status: 400 })
    }

    await prisma.analyticsEvent.create({
      data: {
        event,
        userId: userId || null,
        sessionId: sessionId || null,
        productId: data?.productId || null,
        orderId: data?.orderId || null,
        data: data ? JSON.stringify(data) : null,
        device: device || 'desktop',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Non-blocking
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
