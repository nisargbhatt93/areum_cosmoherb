'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { formatPrice, calculateDiscount } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    mrp: number
    stock: number
    lowStockThreshold: number
    shortDescription?: string | null
    badge?: string | null
    isBestSeller: boolean
    isNewArrival: boolean
    isTrending: boolean
    images: Array<{ url: string; alt?: string | null }>
    reviews: Array<{ rating: number }>
    sku: string
  }
}

function getBadge(product: ProductCardProps['product']): { label: string; className: string } | null {
  if (product.badge) return { label: product.badge, className: 'badge-bestseller' }
  if (product.isBestSeller) return { label: 'Best Seller', className: 'badge-bestseller' }
  if (product.isNewArrival) return { label: 'New', className: 'badge-new' }
  if (product.isTrending) return { label: 'Trending', className: 'badge-trending' }
  if (product.stock > 0 && product.stock <= product.lowStockThreshold)
    return { label: 'Low Stock', className: 'badge-limited' }
  return null
}

function StarRating({ reviews }: { reviews: Array<{ rating: number }> }) {
  if (reviews.length === 0) return null
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
      <span className="text-xs font-medium text-charcoal-700">{avg.toFixed(1)}</span>
      <span className="text-xs text-charcoal-400">({reviews.length})</span>
    </div>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  const discount = calculateDiscount(product.mrp, product.price)
  const badge = getBadge(product)
  const image = product.images[0]?.url || 'https://placehold.co/400x400/edf7f2/1a3a2a?text=Areum'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) {
      toast.error('This product is out of stock.')
      return
    }
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: product.price,
      mrp: product.mrp,
      quantity: 1,
      stock: product.stock,
      sku: product.sku,
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
    })
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  return (
    <article className="card card-hover group relative flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden aspect-square bg-cream-100">
        <Image
          src={image}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 z-10 ${badge.className}`}>{badge.label}</span>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-charcoal-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-colors ${
              inWishlist ? 'text-red-500' : 'text-charcoal-400 hover:text-red-400'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-charcoal-400 hover:text-brand-700 transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`} className="group/name">
          <h3 className="font-medium text-charcoal-800 text-sm leading-tight mb-1 group-hover/name:text-brand-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="text-xs text-charcoal-500 line-clamp-2 mb-2">{product.shortDescription}</p>
        )}

        <StarRating reviews={product.reviews} />

        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.mrp > product.price && (
            <>
              <span className="price-mrp">{formatPrice(product.mrp)}</span>
              <span className="price-discount">{discount}% off</span>
            </>
          )}
        </div>

        {product.stock > 0 && product.stock <= product.lowStockThreshold && (
          <p className="text-xs text-red-500 font-medium mb-2">Only {product.stock} left!</p>
        )}

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary w-full text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
