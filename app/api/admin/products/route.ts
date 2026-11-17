import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { productSchema } from '@/lib/validators'
import { slugify, generateSKU } from '@/lib/utils'

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = productSchema.parse(body)

    const slug = data.slug ? slugify(data.slug) : slugify(data.name)
    const sku = data.sku || generateSKU(data.name)

    // Check unique slug & SKU
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    })
    if (existing) {
      return NextResponse.json({ error: 'A product with this name/slug or SKU already exists.' }, { status: 400 })
    }

    const imageUrl = body.imageUrl || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku,
        description: data.description,
        shortDescription: data.shortDescription || null,
        price: data.price,
        mrp: data.mrp,
        discount: Math.round(((data.mrp - data.price) / data.mrp) * 100),
        categoryId: data.categoryId,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold || 10,
        weight: data.weight || null,
        shelfLife: data.shelfLife || '24 Months',
        suitableFor: data.suitableFor || null,
        howToUse: data.howToUse || null,
        precautions: data.precautions || null,
        benefits: data.benefits || null,
        isFeatured: data.isFeatured || false,
        isBestSeller: data.isBestSeller || false,
        isNewArrival: data.isNewArrival || false,
        isTrending: data.isTrending || false,
        badge: data.badge || null,
        status: data.status || 'active',
        images: {
          create: [{ url: imageUrl, isPrimary: true, sortOrder: 0 }],
        },
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('[Admin Product Create API]', error)
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 400 })
  }
}
