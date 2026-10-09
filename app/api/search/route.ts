import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  const products = await prisma.product.findMany({
    where: {
      status: 'active',
      OR: [
        { name: { contains: q } },
        { shortDescription: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
        { category: { name: { contains: q } } },
      ],
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true } },
    },
    take: limit,
    orderBy: { isBestSeller: 'desc' },
  })

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.images[0]?.url,
      category: p.category.name,
    })),
  })
}
