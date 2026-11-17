import prisma from '@/lib/db'
import CategoryClient from './CategoryClient'

export const metadata = {
  title: 'Category Management | Areum Cosmoherb Admin',
}

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  let categories: any[] = []
  try {
    categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    })
  } catch (err) {
    console.error('[AdminCategoriesPage Error]', err)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Category Management
        </h1>
        <p className="text-xs text-charcoal-500">Organize herbal collections and product grouping on the storefront</p>
      </div>

      <CategoryClient initialCategories={categories as any} />
    </div>
  )
}
