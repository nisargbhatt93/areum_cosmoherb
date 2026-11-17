'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Layers, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  _count: { products: number }
}

export default function CategoryClient({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create category')

      toast.success(`Category "${name}" created successfully!`)
      setShowModal(false)
      setName('')
      setDescription('')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create category.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs text-charcoal-700">
          <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5 rounded-l-xl">Category Name</th>
              <th className="p-3.5">Slug</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Active Products</th>
              <th className="p-3.5 rounded-r-xl text-right">Storefront</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {initialCategories.map((c) => (
              <tr key={c.id} className="hover:bg-cream-50/50 transition-colors">
                <td className="p-3.5 font-bold text-charcoal-900">{c.name}</td>
                <td className="p-3.5 font-mono text-[11px] text-charcoal-400">/{c.slug}</td>
                <td className="p-3.5 text-charcoal-600 max-w-sm truncate">{c.description || '—'}</td>
                <td className="p-3.5 font-extrabold text-brand-800">{c._count.products} products</td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/category/${c.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-brand-700 hover:underline font-semibold text-[11px]"
                  >
                    View ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-charcoal-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-charcoal-900">Add New Category</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-600 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wellness Teas & Elixirs"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-600 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown at top of the category landing page..."
                  className="input-field text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs py-2 px-4 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs py-2 px-5 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
