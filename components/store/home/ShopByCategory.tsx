import Link from 'next/link'
import prisma from '@/lib/db'

const FALLBACK_CATEGORIES = [
  { name: 'Hair Care', slug: 'hair-care', emoji: '💆', color: 'bg-brand-100 hover:bg-brand-200' },
  { name: 'Skin Care', slug: 'skin-care', emoji: '✨', color: 'bg-sage-100 hover:bg-sage-200' },
  { name: 'Bath & Body', slug: 'bath-body', emoji: '🛁', color: 'bg-cream-200 hover:bg-cream-300' },
  { name: 'Lip Care', slug: 'lip-care', emoji: '💋', color: 'bg-rose-50 hover:bg-rose-100' },
  { name: 'Hair Color', slug: 'hair-color', emoji: '🎨', color: 'bg-amber-50 hover:bg-amber-100' },
  { name: 'Combo Packs', slug: 'combo-packs', emoji: '🎁', color: 'bg-purple-50 hover:bg-purple-100' },
]

export default async function ShopByCategory() {
  const categories = await prisma.category
    .findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    })
    .catch(() => [])

  const displayCategories =
    categories.length > 0
      ? categories.map((c, i) => ({
          name: c.name,
          slug: c.slug,
          emoji: FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length].emoji,
          color: FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length].color,
        }))
      : FALLBACK_CATEGORIES

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">Explore</span>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mt-1">Shop by Category</h2>
          <p className="text-charcoal-600 mt-2 max-w-xl mx-auto">
            Find the perfect herbal care products for every need.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cat.color} group`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-semibold text-charcoal-800 text-sm text-center group-hover:text-brand-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
