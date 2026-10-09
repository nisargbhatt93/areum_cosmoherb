'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 999

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-700" />
            <h2 className="font-semibold text-charcoal-800">Your Cart ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="px-6 py-3 bg-brand-50 border-b border-brand-100">
          {remaining > 0 ? (
            <>
              <p className="text-xs text-brand-700 font-medium mb-1.5">
                Add <strong>{formatPrice(remaining)}</strong> more to unlock FREE SHIPPING 🚚
              </p>
              <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full shipping-bar-fill"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-xs text-brand-700 font-semibold">🎉 You&apos;ve unlocked FREE SHIPPING!</p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart className="w-12 h-12 text-charcoal-200 mb-4" />
              <h3 className="font-semibold text-charcoal-700 mb-2">Your cart is empty</h3>
              <p className="text-charcoal-500 text-sm mb-6">
                Discover our herbal products and add them to your cart.
              </p>
              <Link href="/shop" onClick={onClose} className="btn-primary text-sm px-5 py-2.5">
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-charcoal-100 flex-shrink-0">
                  <Image
                    src={item.image || 'https://placehold.co/64x64/edf7f2/1a3a2a?text=A'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={onClose}
                    className="font-medium text-sm text-charcoal-800 hover:text-brand-700 line-clamp-2 block"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-700 font-semibold text-sm">
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp > item.price && (
                      <span className="text-charcoal-400 line-through text-xs">
                        {formatPrice(item.mrp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-charcoal-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-charcoal-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center hover:bg-charcoal-100 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-charcoal-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-charcoal-100 px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-600">Subtotal</span>
              <span className="font-semibold text-charcoal-800">{formatPrice(subtotal)}</span>
            </div>
            {remaining === 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Shipping</span>
                <span className="font-semibold text-brand-600">FREE</span>
              </div>
            )}
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-sm justify-center"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center text-sm text-brand-700 hover:text-brand-800 font-medium"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
