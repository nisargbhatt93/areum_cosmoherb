'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    mrp: '',
    stock: '25',
    lowStockThreshold: '10',
    description: '',
    shortDescription: '',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800',
    weight: '200',
    shelfLife: '24 Months',
    suitableFor: 'All Hair / Skin Types',
    benefits: 'Gentle cleansing, botanical hydration, natural nourishment',
    howToUse: 'Apply gently as part of your everyday herbal routine.',
    precautions: 'For external use only. Perform a patch test before first use.',
    badge: 'New Arrival',
    isBestSeller: false,
    isNewArrival: true,
    isTrending: false,
    status: 'active',
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories?.length > 0) {
          setCategories(data.categories)
          setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }))
        }
      })
      .catch(() => null)
  }, [])

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

    if (!formData.name.trim() || !formData.price || !formData.mrp || !formData.categoryId) {
      toast.error('Please fill in product name, category, and valid pricing.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          mrp: parseFloat(formData.mrp),
          stock: parseInt(formData.stock),
          lowStockThreshold: parseInt(formData.lowStockThreshold),
          weight: parseFloat(formData.weight) || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product')
      }

      toast.success('Product created and published to store catalog!')
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products List
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Create New Herbal Formulation
        </h1>
        <p className="text-xs text-charcoal-500">Add a new item to Areum Cosmoherb product collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Areum Amla & Rosemary Scalp Cleanser"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="input-field text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Badge Tag</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. Best Seller, Trending, Pure Cold-Pressed"
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Short Description (1-2 sentences)</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Mild daily cleanser with pure Amla & Shikakai extract."
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Full Description *</label>
            <textarea
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the herbal formulation, philosophy, and sensory feel..."
              className="input-field text-sm resize-none"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Pricing & Inventory</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">MRP Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="649"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Available Stock *</label>
              <input
                type="number"
                required
                min="0"
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
                min="1"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Image & Specifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Media & Formulation Details</h2>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Primary Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Net Weight (grams)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Shelf Life</label>
              <input
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Suitable For</label>
              <input
                type="text"
                name="suitableFor"
                value={formData.suitableFor}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Benefits (Comma separated)</label>
            <input
              type="text"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">How to Use</label>
              <textarea
                rows={2}
                name="howToUse"
                value={formData.howToUse}
                onChange={handleChange}
                className="input-field text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Precautions & Cautions</label>
              <textarea
                rows={2}
                name="precautions"
                value={formData.precautions}
                onChange={handleChange}
                className="input-field text-sm resize-none"
              />
            </div>
          </div>

          {/* Badges and toggles */}
          <div className="pt-2 flex flex-wrap gap-6 text-xs text-charcoal-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="rounded text-brand-700"
              />
              Mark as Best Seller
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="rounded text-brand-700"
              />
              Mark as New Arrival
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
                className="rounded text-brand-700"
              />
              Mark as Trending
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/products" className="btn-secondary text-xs py-3 px-6 bg-white">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-xs py-3 px-8 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Save & Publish Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
