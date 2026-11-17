'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Truck, CheckCircle, Package, ExternalLink, Save } from 'lucide-react'
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderDetailClientProps {
  order: any
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [courier, setCourier] = useState(order.shipment?.courier || 'Blue Dart Express')
  const [trackingNumber, setTrackingNumber] = useState(order.shipment?.trackingNumber || '')
  const [trackingUrl, setTrackingUrl] = useState(order.shipment?.trackingUrl || 'https://www.bluedart.com')
  const [notes, setNotes] = useState(order.shipment?.notes || '')

  const address: any = safeJsonParse(order.shippingAddress, {})

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          courier,
          trackingNumber,
          trackingUrl,
          notes,
        }),
      })

      if (!res.ok) throw new Error('Update failed')

      toast.success('Order logistics and status successfully updated!')
      router.refresh()
    } catch {
      toast.error('Failed to update order.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Items and Customer Address */}
      <div className="lg:col-span-7 space-y-6">
        {/* Ordered Items */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">
            Package Items ({order.items.length})
          </h2>

          <div className="divide-y divide-charcoal-100">
            {order.items.map((item: any) => {
              const img = item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'
              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      <Image src={img} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-charcoal-900 line-clamp-1">{item.productName}</h4>
                      <p className="text-[11px] text-charcoal-500 font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-brand-800">{formatPrice(item.total)}</span>
                    <span className="text-[11px] text-charcoal-500 block">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pricing totals */}
          <div className="pt-4 border-t border-charcoal-100 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-600">
              <span>Shipping Fee:</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-charcoal-900 pt-2 border-t border-charcoal-100">
              <span>Grand Total:</span>
              <span className="text-brand-800">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-3 text-xs">
          <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">
            Shipping & Customer Details
          </h2>
          <div>
            <span className="font-bold text-charcoal-800 block text-sm">{address.name || order.guestName}</span>
            <p className="text-charcoal-600 mt-1">Phone: <strong>{address.phone || order.guestPhone || 'Not provided'}</strong></p>
            <p className="text-charcoal-600">Email: <strong>{address.email || order.guestEmail || 'Not provided'}</strong></p>
            <p className="text-charcoal-600 mt-2 leading-relaxed">
              {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
              {address.city}, {address.state} - {address.pincode}, India
            </p>
          </div>
        </div>
      </div>

      {/* Right: Fulfillment & Logistics Status Controller */}
      <div className="lg:col-span-5 space-y-6">
        <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-700" /> Logistics Control
          </h2>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Fulfillment Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field text-sm font-bold capitalize"
            >
              <option value="pending">Pending (Order Logged)</option>
              <option value="confirmed">Confirmed (Payment Verified)</option>
              <option value="processing">Processing (Lab Batch Prep)</option>
              <option value="packed">Packed (Eco Boxed)</option>
              <option value="shipped">Shipped (In Transit)</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered (Completed)</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Payment Status *</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="input-field text-sm capitalize"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed (Paid)</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Courier Partner</label>
            <input
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="e.g. Blue Dart, Delhivery, DTDC"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">AWB Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BLUEDART-99210384"
              className="input-field text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Tracking URL</label>
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://www.bluedart.com"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Internal Operations Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dispatched batch #2026-09. Blue Dart pickup agent verified."
              className="input-field text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn-primary w-full py-3 text-xs font-bold shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> {isUpdating ? 'Updating...' : 'Save Logistics Updates'}
          </button>
        </form>
      </div>
    </div>
  )
}
