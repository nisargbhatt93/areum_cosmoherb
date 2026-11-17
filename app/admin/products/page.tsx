import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Archive, ExternalLink, Package } from 'lucide-react'

export const metadata = {
  title: 'Manage Products | Areum Cosmoherb Admin',
}

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('[AdminProductsPage Error]', err)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-charcoal-500">Manage formulations, pricing, badges, and inventory levels</p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-10 h-10 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-charcoal-900 text-sm">No Products Found</h3>
            <p className="text-xs text-charcoal-500">Add your first herbal personal care product to get started.</p>
            <Link href="/admin/products/new" className="btn-primary text-xs py-2 px-4 inline-block">
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price / MRP</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Badges</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {products.map((p) => {
                  const img = p.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'
                  const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold
                  return (
                    <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link href={`/product/${p.slug}`} target="_blank" className="font-bold text-charcoal-900 hover:text-brand-700 line-clamp-1 flex items-center gap-1">
                            {p.name} <ExternalLink className="w-2.5 h-2.5 text-charcoal-400" />
                          </Link>
                          <span className="text-[10px] text-charcoal-400 font-mono">SKU: {p.sku}</span>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium">{p.category?.name || 'Uncategorized'}</td>

                      <td className="p-3.5">
                        <span className="font-bold text-brand-800">{formatPrice(p.price)}</span>
                        <span className="text-charcoal-400 line-through block text-[10px]">{formatPrice(p.mrp)}</span>
                      </td>

                      <td className="p-3.5">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          p.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {p.stock === 0 ? '0 (Out)' : `${p.stock} units`}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {p.isBestSeller && <span className="badge-bestseller text-[9px] px-1.5">Best Seller</span>}
                          {p.isNewArrival && <span className="badge-new text-[9px] px-1.5">New</span>}
                          {p.badge && !p.isBestSeller && !p.isNewArrival && (
                            <span className="badge-trending text-[9px] px-1.5">{p.badge}</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`capitalize font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          p.status === 'active' ? 'bg-brand-50 text-brand-800' : 'bg-charcoal-100 text-charcoal-600'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 hover:bg-cream-100 rounded-lg text-charcoal-600 hover:text-brand-700 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
