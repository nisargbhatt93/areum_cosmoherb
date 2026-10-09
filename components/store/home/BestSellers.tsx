import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/db'
import ProductCard from '../product/ProductCard'
import ProductCardSkeleton from '../product/ProductCardSkeleton'

async function BestSellerProducts() {
  let products = await prisma.product
    .findMany({
      where: { isBestSeller: true, status: 'active' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { where: { status: 'approved' }, select: { rating: true } },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    })
    .catch(() => [])

  if (products.length === 0) {
    products = await prisma.product
      .findMany({
        where: { status: 'active' },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { where: { status: 'approved' }, select: { rating: true } },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      })
      .catch(() => [])
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 col-span-4">
        <p className="text-charcoal-500 mb-4">Products will appear here once added.</p>
        <Link href="/admin/products/new" className="btn-secondary text-sm">
          Add Products in Admin →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default function BestSellers() {
  return (
    <section className="section bg-cream-50">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">
              Customer Favorites
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mt-1">Best Sellers</h2>
            <p className="text-charcoal-600 mt-2">
              Our most-loved herbal products, chosen by thousands of customers.
            </p>
          </div>
          <Link
            href="/shop?sort=bestselling"
            className="hidden md:flex items-center gap-2 text-brand-700 font-medium hover:text-brand-800 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <BestSellerProducts />
        </Suspense>

        <div className="text-center mt-8">
          <Link href="/shop?sort=bestselling" className="btn-secondary">
            View All Best Sellers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
