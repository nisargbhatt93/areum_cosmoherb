import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import ProductDetailClient from '@/components/store/product/ProductDetailClient'
import FrequentlyBoughtTogether from '@/components/store/product/FrequentlyBoughtTogether'
import ProductReviews from '@/components/store/product/ProductReviews'
import ProductCard from '@/components/store/product/ProductCard'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } }).catch(() => null)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Areum Cosmoherb`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description.slice(0, 160),
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      ingredients: {
        include: { ingredient: true },
        orderBy: { ingredient: { sortOrder: 'asc' } },
      },
      reviews: {
        where: { status: 'approved' },
        orderBy: { createdAt: 'desc' },
      },
      category: true,
    },
  }).catch(() => null)

  if (!product || product.status !== 'active') {
    notFound()
  }

  // Fetch Paired or Related Products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: 'active',
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { where: { status: 'approved' }, select: { rating: true } },
    },
    take: 4,
  }).catch(() => [])

  // Complementary product for Frequently Bought Together
  const pairedProducts = relatedProducts.slice(0, 2).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    mrp: p.mrp,
    sku: p.sku,
    stock: p.stock,
    images: p.images,
  }))

  return (
    <div className="bg-cream-50 min-h-screen py-8">
      <div className="container-custom space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 overflow-x-auto pb-2">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-700">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-brand-700">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-charcoal-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Interactive Product Core */}
        <ProductDetailClient product={product as any} />

        {/* Frequently Bought Together Bundle */}
        {pairedProducts.length > 0 && (
          <FrequentlyBoughtTogether
            currentProduct={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              mrp: product.mrp,
              sku: product.sku,
              stock: product.stock,
              images: product.images,
            }}
            pairedProducts={pairedProducts}
          />
        )}

        {/* Customer Reviews & Form */}
        <ProductReviews productId={product.id} reviews={product.reviews as any} />

        {/* Related Products from the Same Category */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Complete The Routine</span>
                <h3 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                  You May Also Like
                </h3>
              </div>
              {product.category && (
                <Link href={`/category/${product.category.slug}`} className="text-xs font-bold text-brand-700 hover:text-brand-800">
                  View All {product.category.name} →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
