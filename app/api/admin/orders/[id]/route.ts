import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, courier, trackingNumber, trackingUrl, notes, paymentStatus } = body

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        notes: notes || undefined,
        shipment: {
          upsert: {
            create: {
              status: status || 'pending',
              courier: courier || null,
              trackingNumber: trackingNumber || null,
              trackingUrl: trackingUrl || null,
              notes: notes || null,
            },
            update: {
              status: status || undefined,
              courier: courier || undefined,
              trackingNumber: trackingNumber || undefined,
              trackingUrl: trackingUrl || undefined,
              notes: notes || undefined,
            },
          },
        },
      },
      include: {
        shipment: true,
        payment: true,
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('[Admin Order Update API]', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 400 })
  }
}
