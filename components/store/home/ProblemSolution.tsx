import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/db'
import ProductCard from '../product/ProductCard'

async function getProductsByCategory(slug: string, limit = 3) {
  return prisma.product
    .findMany({
      where: { category: { slug }, status: 'active' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        reviews: { where: { status: 'approved' }, select: { rating: true } },
      },
      take: limit,
    })
    .catch(() => [])
}

export default async function ProblemSolution() {
  const hairProducts = await getProductsByCategory('hair-care')
  const skinProducts = await getProductsByCategory('skin-care')

  const sections = [
    {
      problem: 'Looking for a gentler hair-care routine?',
      solution:
        'Explore our herbal hair care range — made with carefully selected botanical extracts for your everyday routine.',
      products: hairProducts,
      cta: 'Shop Hair Care',
      ctaHref: '/category/hair-care',
    },
    {
      problem: 'Everyday herbal skin care',
      solution:
        'Simple, effective skin care made with natural ingredients. Gentle enough for daily use.',
      products: skinProducts,
      cta: 'Shop Skin Care',
      ctaHref: '/category/skin-care',
    },
  ]

  return (
    <section className="section bg-cream-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">
            Curated For You
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mt-1">
            Find What You Need
          </h2>
        </div>

        <div className="space-y-20">
          {sections.map((section, idx) => (
            <div key={idx}>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="max-w-lg">
                  <h3 className="text-2xl font-bold text-charcoal-900 mb-2">{section.problem}</h3>
                  <p className="text-charcoal-600">{section.solution}</p>
                </div>
                <Link
                  href={section.ctaHref}
                  className="flex items-center gap-2 text-brand-700 font-medium hover:text-brand-800 whitespace-nowrap"
                >
                  {section.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {section.products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {section.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-charcoal-100">
                  <p className="text-charcoal-500 mb-4">Products coming soon.</p>
                  <Link href="/shop" className="btn-secondary text-sm">
                    Browse All Products <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
