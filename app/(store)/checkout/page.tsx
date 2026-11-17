'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, Check, Lock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

declare global {
  interface Window {
    Razorpay?: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, couponCode, couponDiscount, getSubtotal } = useCartStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
    saveAddress: true,
  })

  const subtotal = getSubtotal()
  const isFreeShipping = subtotal >= 999
  const shippingFee = isFreeShipping ? 0 : 60
  const codFee = formData.paymentMethod === 'cod' ? 40 : 0
  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee + codFee)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Your cart is empty.')
      router.push('/shop')
      return
    }

    // Pincode validation: 6-digit Indian pincode
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit Indian postal PIN code.')
      return
    }

    // Phone validation: 10-digit Indian phone
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Post to checkout API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          couponCode: couponCode || undefined,
          cartItems: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.')
      }

      // If Cash on Delivery (COD)
      if (formData.paymentMethod === 'cod') {
        clearCart()
        toast.success('Order placed successfully via Cash on Delivery!')
        router.push(`/order-confirmed/${data.orderId}`)
        return
      }

      // If Razorpay online payment
      if (formData.paymentMethod === 'razorpay') {
        // Check if Razorpay script is loaded or sandbox simulation
        if (typeof window !== 'undefined' && window.Razorpay && data.razorpayOrderId && !data.razorpayOrderId.startsWith('mock_')) {
          const options = {
            key: data.razorpayKeyId || 'rzp_test_placeholder',
            amount: Math.round(data.total * 100),
            currency: 'INR',
            name: 'Areum Cosmoherb',
            description: `Order #${data.orderNumber}`,
            order_id: data.razorpayOrderId,
            handler: async function (response: any) {
              // Confirm payment
              await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }).catch(() => null)

              clearCart()
              toast.success('Payment verified! Your order has been placed.')
              router.push(`/order-confirmed/${data.orderId}`)
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#1a3a2a',
            },
          }
          const rzp = new window.Razorpay(options)
          rzp.open()
        } else {
          // Sandbox / mock payment simulation mode
          toast.info('Razorpay Sandbox: Processing payment simulation...')
          setTimeout(() => {
            clearCart()
            toast.success('Payment confirmed in test mode!')
            router.push(`/order-confirmed/${data.orderId}`)
          }, 1200)
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed. Please check your details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-cream-50">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-2">No items to checkout</h2>
        <p className="text-sm text-charcoal-600 mb-6">Your cart is currently empty.</p>
        <Link href="/shop" className="btn-primary text-sm">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-cream-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              Secure Checkout
            </h1>
            <div className="flex items-center gap-2 text-xs text-brand-800 font-semibold bg-brand-50 px-3 py-1.5 rounded-full">
              <Lock className="w-3.5 h-3.5 text-brand-700" /> 256-bit Encrypted
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Customer Information & Delivery Address */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
                <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-800 text-white rounded-full text-xs flex items-center justify-center">1</span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-600 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Aditi Sharma"
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-600 block mb-1">Mobile Number *</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-charcoal-200 bg-charcoal-50 text-xs font-semibold text-charcoal-600 rounded-l-lg">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="input-field rounded-l-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com (For order invoice & updates)"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
                <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-800 text-white rounded-full text-xs flex items-center justify-center">2</span>
                  Delivery Address
                </h2>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Street Address / House / Flat No. *</label>
                  <input
                    type="text"
                    name="line1"
                    required
                    value={formData.line1}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Lotus Heights, 12th Main"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Apartment, Landmark, Area (optional)</label>
                  <input
                    type="text"
                    name="line2"
                    value={formData.line2}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Central Park"
                    className="input-field text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-600 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 560001"
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-600 block mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru"
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-600 block mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    >
                      {[
                        'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Haryana',
                        'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan',
                        'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other',
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
                <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-800 text-white rounded-full text-xs flex items-center justify-center">3</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Razorpay Online */}
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col gap-2 transition-all ${
                      formData.paymentMethod === 'razorpay'
                        ? 'border-brand-700 bg-brand-50/50'
                        : 'border-charcoal-200 hover:border-charcoal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-700" />
                        <span className="font-bold text-sm text-charcoal-900">Online Payment</span>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleInputChange}
                        className="text-brand-700"
                      />
                    </div>
                    <p className="text-xs text-charcoal-500">
                      UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards & Net Banking.
                    </p>
                    <span className="text-[11px] font-bold text-green-700 mt-auto">
                      ⚡ Zero transaction fees
                    </span>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col gap-2 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-brand-700 bg-brand-50/50'
                        : 'border-charcoal-200 hover:border-charcoal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-brand-700" />
                        <span className="font-bold text-sm text-charcoal-900">Cash on Delivery</span>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="text-brand-700"
                      />
                    </div>
                    <p className="text-xs text-charcoal-500">
                      Pay with cash or UPI upon delivery at your doorstep.
                    </p>
                    <span className="text-[11px] font-medium text-charcoal-500 mt-auto">
                      + ₹40 courier handling fee
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Review & Total Summary */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-charcoal-900 border-b border-charcoal-100 pb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Review Your Items ({items.length})
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-0 right-0 bg-brand-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-charcoal-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-charcoal-500">{formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="space-y-3 pt-4 border-t border-charcoal-100 text-sm">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-charcoal-900">{formatPrice(subtotal)}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Promo Discount ({couponCode})</span>
                      <span>- {formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-charcoal-600">
                    <span>Shipping Charges</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="font-bold text-green-700">FREE</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  {formData.paymentMethod === 'cod' && (
                    <div className="flex justify-between text-charcoal-600">
                      <span>COD Courier Handling</span>
                      <span className="font-medium text-charcoal-800">₹40</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-charcoal-900 pt-3 border-t border-charcoal-200">
                    <span>Total Payable</span>
                    <span className="text-2xl text-brand-800">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Processing Order...'
                    : formData.paymentMethod === 'cod'
                    ? `Confirm Order (${formatPrice(finalTotal)})`
                    : `Pay Securely (${formatPrice(finalTotal)})`}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-charcoal-500 pt-2 border-t border-charcoal-100">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-700" /> Authentic Herbal
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-brand-700" /> Pan-India Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
