'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

const TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Order received & logged' },
  { key: 'confirmed', label: 'Payment Confirmed', desc: 'Transaction verified' },
  { key: 'processing', label: 'Processing', desc: 'Herbal lab batch selection' },
  { key: 'packed', label: 'Packed', desc: 'Carefully packed with eco protection' },
  { key: 'shipped', label: 'Shipped', desc: 'Dispatched to logistics partner' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent on the way' },
  { key: 'delivered', label: 'Delivered', desc: 'Handed over to customer' },
]

function getStepIndex(status: string) {
  switch (status.toLowerCase()) {
    case 'pending': return 0
    case 'confirmed': return 1
    case 'processing': return 2
    case 'packed': return 3
    case 'shipped': return 4
    case 'out_for_delivery': return 5
    case 'delivered': return 6
    case 'cancelled': return -1
    default: return 1
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const initialOrderNumber = searchParams.get('orderNumber') || ''

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber)
  const [contactQuery, setContactQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleTrackSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!orderNumber.trim()) {
      toast.error('Please enter your Order Number')
      return
    }
    if (!contactQuery.trim()) {
      toast.error('Please enter the email or phone used at checkout')
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          query: contactQuery.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not find tracking information.')
        setOrderData(null)
      } else {
        setOrderData(data)
        toast.success(`Tracking found for #${data.orderNumber}`)
      }
    } catch {
      toast.error('Failed to connect to tracking system.')
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-fill demo order test if query is empty
  useEffect(() => {
    if (initialOrderNumber === 'AC-DEMO-1001' && !contactQuery) {
      setContactQuery('aditi@example.com')
    }
  }, [initialOrderNumber, contactQuery])

  const currentStep = orderData ? getStepIndex(orderData.status) : 0
  const isCancelled = orderData?.status === 'cancelled'

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container-custom max-w-4xl space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Real-Time Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Track Your Order
          </h1>
          <p className="text-sm text-charcoal-600 max-w-md mx-auto">
            Enter your Areum order number along with the mobile number or email address provided during checkout.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-sm">
          <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Order Number *</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. AC-DEMO-1001"
                className="input-field text-sm uppercase"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Email or Phone Number *</label>
              <input
                type="text"
                required
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
                placeholder="e.g. aditi@example.com or 9876543210"
                className="input-field text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-xs font-bold whitespace-nowrap justify-center disabled:opacity-50"
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>Need a test order?</span>
            <button
              type="button"
              onClick={() => {
                setOrderNumber('AC-DEMO-1001')
                setContactQuery('aditi@example.com')
              }}
              className="font-bold text-brand-700 hover:underline"
            >
              Load Demo Order (AC-DEMO-1001)
            </button>
          </div>
        </div>

        {/* Tracking Timeline & Details */}
        {orderData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Status Summary Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-lg text-charcoal-900 font-mono">#{orderData.orderNumber}</span>
                  <span className="bg-brand-50 text-brand-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {orderData.status}
                  </span>
                </div>
                <p className="text-xs text-charcoal-500">
                  Placed on {formatDate(orderData.createdAt)} • Destination: {orderData.address.city}, {orderData.address.state}
                </p>
              </div>

              {orderData.expectedDelivery && (
                <div className="bg-cream-100 px-5 py-3 rounded-2xl border border-cream-200 text-right">
                  <span className="text-xs text-charcoal-500 block">Estimated Arrival</span>
                  <span className="font-extrabold text-brand-800 text-sm">{formatDate(orderData.expectedDelivery)}</span>
                </div>
              )}
            </div>

            {/* Visual Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-100 shadow-sm">
              <h2 className="text-lg font-bold text-charcoal-900 mb-8 border-b border-charcoal-100 pb-4">
                Shipment Progress
              </h2>

              {isCancelled ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 text-red-700">
                  <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base">Order Cancelled</h3>
                    <p className="text-xs text-red-600 mt-1">
                      This order was cancelled. If you were billed, your refund is processed to the original payment method within 5-7 working days.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline track on desktop */}
                  <div className="hidden md:flex items-center justify-between relative mb-8">
                    {/* Background line */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-charcoal-200 z-0" />
                    {/* Active line */}
                    <div
                      className="absolute top-5 left-6 h-1 bg-brand-600 z-0 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (currentStep / (TRACKING_STEPS.length - 1)) * 100)}%`,
                      }}
                    />

                    {TRACKING_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStep
                      const isCurrent = idx === currentStep
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 text-center max-w-[100px]">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isDone
                                ? 'bg-brand-700 text-white shadow-md'
                                : 'bg-white border-2 border-charcoal-300 text-charcoal-400'
                            } ${isCurrent ? 'ring-4 ring-brand-100 scale-110' : ''}`}
                          >
                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-bold mt-3 line-clamp-1 ${
                              isDone ? 'text-charcoal-900' : 'text-charcoal-400'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[10px] text-charcoal-500 mt-0.5 line-clamp-2">
                            {step.desc}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Vertical timeline for mobile */}
                  <div className="md:hidden space-y-6 relative border-l-2 border-charcoal-200 ml-4 pl-6">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStep
                      return (
                        <div key={step.key} className="relative">
                          <div
                            className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isDone ? 'bg-brand-700 text-white' : 'bg-white border-2 border-charcoal-300 text-charcoal-400'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${isDone ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
                              {step.label}
                            </h4>
                            <p className="text-xs text-charcoal-500">{step.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Courier info card */}
              {orderData.shipment && (
                <div className="mt-10 p-5 bg-cream-50 rounded-2xl border border-charcoal-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-charcoal-400 block">Courier Partner</span>
                      <span className="font-bold text-sm text-charcoal-800">
                        {orderData.shipment.courier || 'Blue Dart / Delhivery Express'}
                      </span>
                      {orderData.shipment.trackingNumber && (
                        <span className="block text-xs text-charcoal-600 font-mono mt-0.5">
                          Tracking AWB: <strong>{orderData.shipment.trackingNumber}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {orderData.shipment.trackingUrl && (
                    <a
                      href={orderData.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto bg-white"
                    >
                      Courier Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Items in this shipment */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-charcoal-900 border-b border-charcoal-100 pb-3">
                Items In This Package ({orderData.items.length})
              </h3>
              <div className="divide-y divide-charcoal-100">
                {orderData.items.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-charcoal-800 line-clamp-1">{item.name}</h4>
                      <span className="text-xs text-charcoal-400">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-brand-800">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasSearched && !orderData && !isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 shadow-sm">
            <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-charcoal-900 mb-1">No Matching Order Found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
              Please double check the Order Number (e.g. AC-DEMO-1001) and the exact phone or email address you used at checkout.
            </p>
            <button
              onClick={() => {
                setOrderNumber('AC-DEMO-1001')
                setContactQuery('aditi@example.com')
              }}
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              Try loading sample order AC-DEMO-1001
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-charcoal-500">Loading tracking system...</div>}>
      <TrackOrderContent />
    </Suspense>
  )
}
