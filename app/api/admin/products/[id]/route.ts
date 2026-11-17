import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price ? parseFloat(body.price) : undefined,
        mrp: body.mrp ? parseFloat(body.mrp) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        lowStockThreshold: body.lowStockThreshold !== undefined ? parseInt(body.lowStockThreshold) : undefined,
        description: body.description,
        shortDescription: body.shortDescription,
        status: body.status,
        badge: body.badge,
        isFeatured: body.isFeatured,
        isBestSeller: body.isBestSeller,
        isNewArrival: body.isNewArrival,
        isTrending: body.isTrending,
        howToUse: body.howToUse,
        benefits: body.benefits,
        precautions: body.precautions,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('[Admin Product Update API]', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft archive rather than destroying historical data
    await prisma.product.update({
      where: { id },
      data: { status: 'archived' },
    })

    return NextResponse.json({ success: true, message: 'Product archived successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to archive product' }, { status: 500 })
  }
}
