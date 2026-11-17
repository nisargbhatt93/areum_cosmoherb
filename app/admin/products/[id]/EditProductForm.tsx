'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Archive } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

const DEFAULT_CATEGORIES = [
  { id: 'cmtopj82o000btpm8aewt1zxt', name: 'Hair Care' },
  { id: 'cmtopj82v000ctpm8kkr3qkg9', name: 'Skin Care' },
  { id: 'cmtopj832000dtpm8dsra4680', name: 'Bath & Body' },
  { id: 'cmtopj83a000etpm8dwv1dx43', name: 'Lip Care' },
  { id: 'cmtopj83i000ftpm8hukasawl', name: 'Hair Color' },
  { id: 'cmtopj83r000gtpm88pdzh6al', name: 'Combo Packs' },
]

interface EditProductFormProps {
  product: any
  categories: Array<{ id: string; name: string }>
}

export default function EditProductForm({ product, categories = [] }: EditProductFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  // Use passed categories or fallback
  const categoryList = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES

  const [formData, setFormData] = useState({
    name: product.name,
    categoryId: product.categoryId || categoryList[0]?.id || '',
    imageUrl: product.images?.[0]?.url || '',
    price: product.price.toString(),
    mrp: product.mrp.toString(),
    stock: product.stock.toString(),
    lowStockThreshold: (product.lowStockThreshold || 10).toString(),
    description: product.description,
    shortDescription: product.shortDescription || '',
    badge: product.badge || '',
    benefits: product.benefits || '',
    howToUse: product.howToUse || '',
    precautions: product.precautions || '',
    status: product.status || 'active',
    isBestSeller: !!product.isBestSeller,
    isNewArrival: !!product.isNewArrival,
    isTrending: !!product.isTrending,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Update failed')

      toast.success('Product details updated!')
      router.push('/admin/products')
      router.refresh()
    } catch {
      toast.error('Failed to update product.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this product? It will be hidden from the storefront.')) {
      return
    }

    setIsArchiving(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Archive failed')

      toast.success('Product safely archived.')
      router.push('/admin/products')
      router.refresh()
    } catch {
      toast.error('Failed to archive product.')
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Formulation & Pricing</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Category *</label>
            <select
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="input-field text-sm cursor-pointer"
            >
              {categoryList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field text-sm capitalize"
            >
              <option value="active">Active (Visible)</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Selling Price (₹) *</label>
            <input
              type="number"
              required
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">MRP Price (₹) *</label>
            <input
              type="number"
              required
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Stock Units *</label>
            <input
              type="number"
              required
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Low Stock Alert *</label>
            <input
              type="number"
              required
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-charcoal-600 block mb-1">Badge Tag</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="e.g. Best Seller, Pure Bliss"
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-charcoal-600 block mb-1">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-charcoal-600 block mb-1">Full Description</label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field text-sm resize-none"
          />
        </div>

        <div className="pt-2 flex flex-wrap gap-6 text-xs text-charcoal-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleChange}
              className="rounded text-brand-700"
            />
            Best Seller
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleChange}
              className="rounded text-brand-700"
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isTrending"
              checked={formData.isTrending}
              onChange={handleChange}
              className="rounded text-brand-700"
            />
            Trending
          </label>
        </div>
      </div>

      {/* Media / Image Upload Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Product Media</h2>

        <ImageUploader
          label="Primary Product Image"
          value={formData.imageUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleArchive}
          disabled={isArchiving}
          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold cursor-pointer"
        >
          <Archive className="w-4 h-4" /> Archive Product
        </button>

        <div className="flex gap-3">
          <Link href="/admin/products" className="btn-secondary text-xs py-2.5 px-5 bg-white">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary text-xs py-2.5 px-6 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
