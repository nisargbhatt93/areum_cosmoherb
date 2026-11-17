'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Tag, Check, ArrowLeft, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 999

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    removeItem,
    updateQuantity,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
  } = useCartStore()

  const [inputCode, setInputCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const subtotal = getSubtotal()
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return

    setIsValidating(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inputCode.trim(),
          cartItems: items.map((i) => ({
            productId: i.productId,
            price: i.price,
            mrp: i.mrp,
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json()
      if (data.valid) {
        applyCoupon(inputCode.trim().toUpperCase(), data.discount, data.couponId)
        toast.success(data.message || 'Coupon applied successfully!')
        setInputCode('')
      } else {
        toast.error(data.message || 'Invalid coupon code.')
      }
    } catch {
      toast.error('Failed to validate coupon.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast.info('Coupon removed')
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 60
  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee)

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center border border-charcoal-100 shadow-sm">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-700">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Your Cart is Empty
          </h1>
          <p className="text-sm text-charcoal-600 mb-8 leading-relaxed">
            Looks like you haven&apos;t added any herbal wellness products to your cart yet. Explore our best sellers and treat yourself to natural care.
          </p>
          <Link href="/shop" className="btn-primary w-full text-sm font-semibold">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Title & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              Shopping Cart ({items.length})
            </h1>
          </div>

          {/* Dynamic Free Shipping Bar */}
          <div className="bg-white p-4 rounded-2xl border border-charcoal-100 max-w-sm w-full">
            {remaining > 0 ? (
              <>
                <p className="text-xs text-charcoal-700 mb-1.5">
                  Add <strong className="text-brand-800">{formatPrice(remaining)}</strong> more to get <strong>FREE SHIPPING</strong> 🚚
                </p>
                <div className="h-2 bg-charcoal-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs font-bold text-green-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> You&apos;ve unlocked FREE SHIPPING across India!
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-charcoal-100 shadow-2xs flex flex-col sm:flex-row items-center gap-5"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-bold text-charcoal-900 hover:text-brand-700 text-sm sm:text-base line-clamp-1 block transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-charcoal-400">SKU: {item.sku}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="font-extrabold text-brand-800 text-base">{formatPrice(item.price)}</span>
                    {item.mrp > item.price && (
                      <span className="text-xs text-charcoal-400 line-through">{formatPrice(item.mrp)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center border border-charcoal-200 rounded-xl bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-cream-100 transition-colors rounded-l-xl"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-charcoal-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-cream-100 disabled:opacity-30 transition-colors rounded-r-xl"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.productId)
                      toast.info('Item removed from cart')
                    }}
                    className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Trust badge strip */}
            <div className="bg-white rounded-2xl p-5 border border-charcoal-100 flex flex-wrap items-center justify-around gap-4 text-xs text-charcoal-600">
              <span className="flex items-center gap-1.5 font-semibold text-brand-800">
                <ShieldCheck className="w-4 h-4 text-brand-700" /> Secure 256-bit Checkout
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-brand-800">
                <Truck className="w-4 h-4 text-brand-700" /> Dispatched in 24 Hours
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-brand-800">
                🌿 Fresh Herbal Formulations
              </span>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-sm space-y-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-charcoal-900 border-b border-charcoal-100 pb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Have a Coupon or Promo Code?
              </label>

              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-brand-50 border border-brand-200 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-brand-800">{couponCode}</span>
                    <span className="text-xs text-brand-600 block">Saved ₹{couponDiscount}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AREUM10"
                    className="input-field text-xs uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="btn-secondary py-2 px-4 text-xs font-bold whitespace-nowrap disabled:opacity-50"
                  >
                    {isValidating ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Coupon suggestion chip */}
              {!couponCode && (
                <p className="text-[11px] text-charcoal-500">
                  Tip: Use coupon <button onClick={() => setInputCode('AREUM10')} className="font-bold text-brand-700 hover:underline">AREUM10</button> for 10% off!
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-charcoal-100 text-sm">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-charcoal-800">{formatPrice(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>- {formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-charcoal-600">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-green-700">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-charcoal-900 pt-3 border-t border-charcoal-200">
                <span>Total Amount</span>
                <span className="text-xl text-brand-800">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-charcoal-400 text-center">
              Taxes calculated at checkout. Supports UPI, Cards, Netbanking & Cash on Delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
