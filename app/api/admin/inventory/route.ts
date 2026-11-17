import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { productId, adjustment, reason } = await request.json()

    if (!productId || adjustment === undefined) {
      return NextResponse.json({ error: 'Product ID and adjustment quantity are required' }, { status: 400 })
    }

    const qty = parseInt(adjustment)

    const [product, transaction] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: qty } },
      }),
      prisma.inventoryTransaction.create({
        data: {
          productId,
          type: qty > 0 ? 'restock' : 'adjustment',
          quantity: qty,
          reason: reason || 'Manual inventory adjustment via admin panel',
        },
      }),
    ])

    return NextResponse.json({ success: true, product, transaction })
  } catch (error) {
    console.error('[Inventory Adjust API]', error)
    return NextResponse.json({ error: 'Failed to adjust inventory' }, { status: 500 })
  }
}
