import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import ProductCard from '@/components/store/product/ProductCard'
import { ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } }).catch(() => null)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category.name} | Areum Cosmoherb`,
    description: category.description || `Shop authentic herbal ${category.name} from Areum Cosmoherb.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: 'active' },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          reviews: { where: { status: 'approved' }, select: { rating: true } },
        },
        orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
      },
    },
  }).catch(() => null)

  if (!category) {
    notFound()
  }

  return (
    <div className="bg-cream-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 mb-6">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-700">Shop</Link>
          <span>/</span>
          <span className="text-charcoal-900 font-semibold">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-10 border border-charcoal-100 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-3">
              Herbal Care Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-charcoal-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {category.name}
            </h1>
            {category.description && (
              <p className="text-charcoal-600 text-base md:text-lg leading-relaxed mb-6">
                {category.description}
              </p>
            )}
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
              <ArrowLeft className="w-4 h-4" /> View All Collections
            </Link>
          </div>
        </div>

        {/* Products */}
        {category.products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-charcoal-100 p-12 text-center">
            <p className="text-charcoal-600 mb-4">No products currently available in this category.</p>
            <Link href="/shop" className="btn-primary text-sm">
              Explore All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
