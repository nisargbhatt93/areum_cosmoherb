import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  const sort = searchParams.get('sort') || 'featured'
  const q = searchParams.get('q')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { status: 'active' }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { description: { contains: q } },
    ]
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
  }

  const orderBy: Record<string, unknown>[] = []
  switch (sort) {
    case 'bestselling':
      orderBy.push({ isBestSeller: 'desc' })
      break
    case 'newest':
      orderBy.push({ createdAt: 'desc' })
      break
    case 'price-asc':
      orderBy.push({ price: 'asc' })
      break
    case 'price-desc':
      orderBy.push({ price: 'desc' })
      break
    default:
      orderBy.push({ isFeatured: 'desc' })
      orderBy.push({ isBestSeller: 'desc' })
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { where: { status: 'approved' }, select: { rating: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy,
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
