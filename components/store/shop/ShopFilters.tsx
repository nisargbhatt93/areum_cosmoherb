'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

interface ShopFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
  activeCategory?: string
  activeSort?: string
}

export default function ShopFilters({ categories, activeCategory, activeSort }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault()
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (minPrice) current.set('minPrice', minPrice)
    else current.delete('minPrice')
    if (maxPrice) current.set('maxPrice', maxPrice)
    else current.delete('maxPrice')

    router.push(`/shop?${current.toString()}`)
  }

  const handleClearFilters = () => {
    router.push('/shop')
  }

  const hasActiveFilters = !!(activeCategory || searchParams.get('minPrice') || searchParams.get('maxPrice') || searchParams.get('q'))

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 p-5 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
        <h3 className="font-bold text-charcoal-900 text-sm tracking-wide uppercase">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-xs text-charcoal-500 uppercase tracking-wider mb-3">Categories</h4>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="/shop"
              className={`block px-3 py-2 rounded-lg transition-colors ${!activeCategory ? 'bg-brand-50 text-brand-800 font-semibold' : 'text-charcoal-700 hover:bg-cream-50'}`}
            >
              All Categories
            </Link>
          </li>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug
            return (
              <li key={cat.id}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isSelected ? 'bg-brand-50 text-brand-800 font-semibold' : 'text-charcoal-700 hover:bg-cream-50'}`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-700" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-charcoal-100">
        <h4 className="font-semibold text-xs text-charcoal-500 uppercase tracking-wider mb-3">Price Range (₹)</h4>
        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-1.5 border border-charcoal-200 rounded-lg text-sm focus:outline-none focus:border-brand-600"
              min="0"
            />
            <span className="text-charcoal-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-1.5 border border-charcoal-200 rounded-lg text-sm focus:outline-none focus:border-brand-600"
              min="0"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 font-medium text-xs rounded-lg transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Trust & Guarantee Box */}
      <div className="pt-4 border-t border-charcoal-100 bg-cream-50 p-4 rounded-xl text-xs text-charcoal-600 space-y-2">
        <p className="font-semibold text-brand-800">🌿 Pure Herbal Promise</p>
        <p>Crafted in small batches with genuine botanical extracts. No harmful additives or synthetic fragrances.</p>
      </div>
    </div>
  )
}
