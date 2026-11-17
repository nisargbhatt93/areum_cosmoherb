import { Suspense } from 'react'
import Link from 'next/link'
import prisma from '@/lib/db'
import ProductCard from '@/components/store/product/ProductCard'
import ProductCardSkeleton from '@/components/store/product/ProductCardSkeleton'
import ShopFilters from '@/components/store/shop/ShopFilters'
import { Filter, SlidersHorizontal } from 'lucide-react'

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    q?: string
  }>
}

export const metadata = {
  title: 'Shop All Herbal Products | Areum Cosmoherb',
  description: 'Explore our full collection of natural herbal hair care, skin care, and body care products.',
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const categorySlug = params.category
  const sort = params.sort || 'featured'
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined
  const q = params.q

  const where: any = { status: 'active' }

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

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  const orderBy: any = []
  if (sort === 'price-asc') orderBy.push({ price: 'asc' })
  else if (sort === 'price-desc') orderBy.push({ price: 'desc' })
  else if (sort === 'newest') orderBy.push({ createdAt: 'desc' })
  else if (sort === 'bestselling') orderBy.push({ isBestSeller: 'desc' })
  else orderBy.push({ isFeatured: 'desc' }, { isBestSeller: 'desc' })

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { where: { status: 'approved' }, select: { rating: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy,
    }).catch(() => []),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }).catch(() => []),
  ])

  return (
    <div className="bg-cream-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex text-xs text-charcoal-500 mb-3 gap-2">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <span>/</span>
            <span className="text-charcoal-800 font-medium">Shop</span>
            {categorySlug && (
              <>
                <span>/</span>
                <span className="capitalize text-brand-700 font-semibold">{categorySlug.replace('-', ' ')}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                {categorySlug ? `${categorySlug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}` : 'All Products'}
              </h1>
              <p className="text-sm text-charcoal-600 mt-1">
                Showing {products.length} natural herbal {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Quick Sort Links */}
            <div className="flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-lg border border-charcoal-200">
              <span className="text-charcoal-500 text-xs font-medium">Sort:</span>
              <Link
                href={{ query: { ...params, sort: 'featured' } }}
                className={`px-2 py-1 rounded text-xs ${sort === 'featured' ? 'bg-brand-700 text-white font-medium' : 'text-charcoal-700 hover:text-brand-700'}`}
              >
                Featured
              </Link>
              <Link
                href={{ query: { ...params, sort: 'bestselling' } }}
                className={`px-2 py-1 rounded text-xs ${sort === 'bestselling' ? 'bg-brand-700 text-white font-medium' : 'text-charcoal-700 hover:text-brand-700'}`}
              >
                Best Sellers
              </Link>
              <Link
                href={{ query: { ...params, sort: 'price-asc' } }}
                className={`px-2 py-1 rounded text-xs ${sort === 'price-asc' ? 'bg-brand-700 text-white font-medium' : 'text-charcoal-700 hover:text-brand-700'}`}
              >
                Price: Low to High
              </Link>
              <Link
                href={{ query: { ...params, sort: 'price-desc' } }}
                className={`px-2 py-1 rounded text-xs ${sort === 'price-desc' ? 'bg-brand-700 text-white font-medium' : 'text-charcoal-700 hover:text-brand-700'}`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="bg-white rounded-2xl p-6 border border-charcoal-100 text-xs text-charcoal-400">Loading filters...</div>}>
              <ShopFilters categories={categories} activeCategory={categorySlug} activeSort={sort} />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-charcoal-100 p-12 text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-700 text-2xl">
                  🍃
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-2">No products found</h3>
                <p className="text-sm text-charcoal-600 mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any products matching your current filters. Try resetting the filters or searching for something else.
                </p>
                <Link href="/shop" className="btn-primary text-sm">
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
