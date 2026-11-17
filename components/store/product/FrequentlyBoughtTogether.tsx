'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

interface PairedProduct {
  id: string
  name: string
  slug: string
  price: number
  mrp: number
  sku: string
  stock: number
  images: Array<{ url: string }>
}

interface FrequentlyBoughtTogetherProps {
  currentProduct: {
    id: string
    name: string
    slug: string
    price: number
    mrp: number
    sku: string
    stock: number
    images: Array<{ url: string }>
  }
  pairedProducts: PairedProduct[]
}

export default function FrequentlyBoughtTogether({ currentProduct, pairedProducts }: FrequentlyBoughtTogetherProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    currentProduct.id,
    ...pairedProducts.map((p) => p.id),
  ])

  if (pairedProducts.length === 0) return null

  const allItems = [currentProduct, ...pairedProducts]
  const activeItems = allItems.filter((item) => selectedIds.includes(item.id))

  const bundleTotal = activeItems.reduce((acc, item) => acc + item.price, 0)
  const bundleMrp = activeItems.reduce((acc, item) => acc + item.mrp, 0)
  const savings = bundleMrp - bundleTotal

  const toggleSelect = (id: string) => {
    if (id === currentProduct.id) return // Must include current product
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAddBundleToCart = () => {
    activeItems.forEach((item) => {
      addItem({
        productId: item.id,
        name: item.name,
        slug: item.slug,
        image: item.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800',
        price: item.price,
        mrp: item.mrp,
        quantity: 1,
        stock: item.stock,
        sku: item.sku,
      })
    })
    toast.success(`Added ${activeItems.length} products to your cart! Saved ₹${savings}`)
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Frequently Bought Together
          </h3>
          <p className="text-xs text-charcoal-500">Pair complementary herbal care products for best routine results.</p>
        </div>
        {savings > 0 && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full self-start">
            Bundle Savings: ₹{savings}
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Product Cards Row */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto w-full lg:w-auto pb-2">
          {allItems.map((item, index) => {
            const isSelected = selectedIds.includes(item.id)
            return (
              <div key={item.id} className="flex items-center gap-3 flex-shrink-0">
                <div
                  onClick={() => toggleSelect(item.id)}
                  className={`cursor-pointer w-28 sm:w-36 p-3 rounded-2xl border text-center transition-all ${
                    isSelected ? 'border-brand-700 bg-brand-50/30' : 'border-charcoal-200 opacity-60'
                  }`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-100 mb-2">
                    <Image
                      src={item.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-bold text-charcoal-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs font-extrabold text-brand-800 mt-1">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex justify-center">
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-brand-700 text-white border-brand-700' : 'border-charcoal-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

                {index < allItems.length - 1 && (
                  <span className="text-charcoal-300 font-bold text-lg flex-shrink-0">+</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Bundle Summary & CTA */}
        <div className="w-full lg:w-64 bg-cream-50 p-5 rounded-2xl border border-charcoal-100 flex-shrink-0 space-y-3">
          <div>
            <span className="text-xs text-charcoal-500 block">Total for {activeItems.length} items:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-brand-800">{formatPrice(bundleTotal)}</span>
              {bundleMrp > bundleTotal && (
                <span className="text-xs text-charcoal-400 line-through">{formatPrice(bundleMrp)}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="btn-primary w-full py-2.5 text-xs font-bold"
          >
            <ShoppingCart className="w-4 h-4" /> Add Routine to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
