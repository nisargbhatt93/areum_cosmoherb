import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, isFeatured } = await request.json()

    const review = await prisma.review.update({
      where: { id },
      data: {
        status: status || undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 400 })
  }
}
