import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { reviewSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { productId, status: 'approved' },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ reviews })
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const body = await request.json()
    const data = reviewSchema.parse(body)

    // Check if user has an order containing this product for verified badge
    let isVerified = false
    if (session?.user?.id) {
      const orderCount = await prisma.order.count({
        where: {
          userId: session.user.id,
          items: { some: { productId: data.productId } },
        },
      })
      if (orderCount > 0) isVerified = true
    }

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: session?.user?.id || null,
        name: data.name,
        email: data.email || null,
        rating: data.rating,
        title: data.title || null,
        body: data.body,
        isVerified,
        status: 'pending', // Requires admin moderation by default
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('[Review API POST]', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 400 })
  }
}
