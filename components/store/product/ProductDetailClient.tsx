'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Plus, Minus, Star, CheckCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { formatPrice, calculateDiscount } from '@/lib/utils'

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    slug: string
    sku: string
    price: number
    mrp: number
    stock: number
    lowStockThreshold: number
    description: string
    shortDescription?: string | null
    weight?: number | null
    shelfLife?: string | null
    suitableFor?: string | null
    howToUse?: string | null
    precautions?: string | null
    benefits?: string | null
    badge?: string | null
    isBestSeller: boolean
    isTrending: boolean
    images: Array<{ url: string; alt?: string | null }>
    ingredients: Array<{ ingredient: { name: string; description?: string | null; benefits?: string | null } }>
    reviews: Array<{ id: string; name: string; rating: number; title?: string | null; body: string; createdAt: Date | string; isVerified: boolean }>
  }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'benefits' | 'howToUse' | 'ingredients' | 'details'>('benefits')

  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const discount = calculateDiscount(product.mrp, product.price)
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold

  const images = product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80', alt: product.name }]

  const activeImage = images[selectedImageIndex] || images[0]

  const averageRating = product.reviews.length > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : '5.0'

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: activeImage.url,
      price: product.price,
      mrp: product.mrp,
      quantity,
      stock: product.stock,
      sku: product.sku,
    })
    toast.success(`Added ${quantity} item(s) to your cart!`)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: activeImage.url,
      price: product.price,
      mrp: product.mrp,
      quantity,
      stock: product.stock,
      sku: product.sku,
    })
    router.push('/checkout')
  }

  const handleWishlist = () => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: activeImage.url,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
    })
    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist!')
  }

  return (
    <div className="space-y-12">
      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Gallery */}
        <div className="space-y-4 sticky top-28">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100 border border-charcoal-100 shadow-sm">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || product.name}
              fill
              unoptimized={activeImage.url.startsWith('data:')}
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 badge-bestseller px-3 py-1 text-xs shadow-md">
                {product.badge}
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-charcoal-900 text-white font-bold px-6 py-2 rounded-full text-sm">
                  Temporarily Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === idx ? 'border-brand-700 ring-2 ring-brand-200' : 'border-charcoal-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt="" fill unoptimized={img.url.startsWith('data:')} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-brand-600 font-bold bg-brand-50 px-2.5 py-0.5 rounded-full">
                Authentic Cosmoherb
              </span>
              <span className="text-xs text-charcoal-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-900 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                <span className="font-bold text-sm text-brand-800">{averageRating}</span>
              </div>
              <span className="text-xs text-charcoal-500">
                Based on {product.reviews.length} verified {product.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white p-5 rounded-2xl border border-charcoal-100 shadow-2xs space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-brand-800">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-charcoal-400 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-md">
                    SAVE {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-charcoal-500">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

            {/* Genuine Stock Indicator */}
            {isLowStock && (
              <div className="pt-2 border-t border-charcoal-100 flex items-center gap-2 text-xs font-semibold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Hurry, only {product.stock} items remaining in stock!
              </div>
            )}
            {!isLowStock && !isOutOfStock && (
              <div className="pt-2 border-t border-charcoal-100 flex items-center gap-1.5 text-xs font-medium text-brand-700">
                <CheckCircle className="w-3.5 h-3.5" /> In stock & ready to ship from our herbal lab
              </div>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-sm text-charcoal-700 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600">Quantity:</span>
              <div className="flex items-center border border-charcoal-200 rounded-xl bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 disabled:opacity-30 rounded-l-xl transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-charcoal-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 disabled:opacity-30 rounded-r-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-sm disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-gold w-full py-3.5 text-sm font-bold shadow-sm disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlist}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                inWishlist ? 'border-red-200 bg-red-50 text-red-600' : 'border-charcoal-200 text-charcoal-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-600 text-red-600' : ''}`} />
              {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-charcoal-200 text-center text-xs text-charcoal-600">
            <div className="p-3 bg-white rounded-xl border border-charcoal-100 flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span className="font-semibold text-charcoal-800">100% Herbal</span>
              <span className="text-[10px] text-charcoal-400">Pure formulations</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-charcoal-100 flex flex-col items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-700" />
              <span className="font-semibold text-charcoal-800">Fast Shipping</span>
              <span className="text-[10px] text-charcoal-400">Pan-India delivery</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-charcoal-100 flex flex-col items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-brand-700" />
              <span className="font-semibold text-charcoal-800">Easy Returns</span>
              <span className="text-[10px] text-charcoal-400">7-day transit policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Information Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-100 shadow-sm">
        <div className="flex border-b border-charcoal-200 gap-4 sm:gap-8 overflow-x-auto pb-px">
          {[
            { id: 'benefits', label: 'Benefits & Efficacy' },
            { id: 'howToUse', label: 'How to Use' },
            { id: 'ingredients', label: `Herbal Ingredients (${product.ingredients.length})` },
            { id: 'details', label: 'Specifications & Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 font-bold text-sm sm:text-base whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand-700 text-brand-800'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                Product Benefits & Natural Action
              </h3>
              <p className="text-charcoal-700 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
              {product.benefits && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {product.benefits.split(',').map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                      <Sparkles className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-charcoal-800">{b.trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                Directions for Everyday Use
              </h3>
              <div className="p-5 bg-cream-50 rounded-2xl border border-cream-200 text-sm text-charcoal-700 leading-relaxed">
                {product.howToUse || 'Apply as directed on the label for everyday herbal care.'}
              </div>
              {product.precautions && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>Important Precaution:</strong> {product.precautions}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                Transparent Herbal Botanicals
              </h3>
              {product.ingredients.length === 0 ? (
                <p className="text-sm text-charcoal-500">Made with carefully selected traditional Ayurvedic herbs.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.ingredients.map(({ ingredient }) => (
                    <div key={ingredient.name} className="p-5 rounded-2xl bg-cream-50 border border-charcoal-100">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-bold text-xs mb-3">
                        🌿
                      </div>
                      <h4 className="font-bold text-charcoal-900 text-sm mb-1">{ingredient.name}</h4>
                      {ingredient.description && (
                        <p className="text-xs text-charcoal-600 leading-relaxed">{ingredient.description}</p>
                      )}
                      {ingredient.benefits && (
                        <p className="text-xs text-brand-700 font-semibold mt-2">Key: {ingredient.benefits}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl border border-charcoal-100">
                <span className="text-xs text-charcoal-400 block mb-1">Net Weight</span>
                <span className="font-bold text-charcoal-800">{product.weight ? `${product.weight}g` : 'Standard Pack'}</span>
              </div>
              <div className="p-4 rounded-xl border border-charcoal-100">
                <span className="text-xs text-charcoal-400 block mb-1">Shelf Life</span>
                <span className="font-bold text-charcoal-800">{product.shelfLife || '24 Months'}</span>
              </div>
              <div className="p-4 rounded-xl border border-charcoal-100">
                <span className="text-xs text-charcoal-400 block mb-1">Suitable For</span>
                <span className="font-bold text-charcoal-800">{product.suitableFor || 'All Skin & Hair Types'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
