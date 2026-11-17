import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils'
import { CheckCircle, Truck, Package, ArrowRight, Home } from 'lucide-react'

interface OrderConfirmedPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      payment: true,
      shipment: true,
    },
  }).catch(() => null)

  if (!order) {
    notFound()
  }

  const address = safeJsonParse(order.shippingAddress, {
    name: order.guestName || 'Customer',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  })

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container-custom max-w-3xl space-y-8">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-charcoal-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="inline-block text-xs uppercase font-bold tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Order Placed Successfully
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Thank You For Your Order!
          </h1>

          <p className="text-charcoal-600 text-sm max-w-md mx-auto">
            We have received your order and our herbal care specialists are preparing your package for dispatch.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="bg-cream-100 px-4 py-2 rounded-xl border border-cream-200">
              <span className="text-charcoal-400 block">Order Number</span>
              <span className="font-extrabold text-charcoal-900 font-mono">{order.orderNumber}</span>
            </div>

            <div className="bg-cream-100 px-4 py-2 rounded-xl border border-cream-200">
              <span className="text-charcoal-400 block">Expected Delivery</span>
              <span className="font-extrabold text-brand-800">
                {order.expectedDelivery ? formatDate(order.expectedDelivery) : 'Within 4-6 Business Days'}
              </span>
            </div>

            <div className="bg-cream-100 px-4 py-2 rounded-xl border border-cream-200">
              <span className="text-charcoal-400 block">Payment Method</span>
              <span className="font-extrabold text-charcoal-900 uppercase">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-charcoal-900 border-b border-charcoal-100 pb-4">
            Items Ordered ({order.items.length})
          </h2>

          <div className="divide-y divide-charcoal-100">
            {order.items.map((item) => {
              const image = item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'
              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={image} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-charcoal-800 line-clamp-1">{item.productName}</h3>
                    <p className="text-xs text-charcoal-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-bold text-sm text-brand-800">{formatPrice(item.total)}</span>
                </div>
              )
            })}
          </div>

          {/* Pricing breakdown */}
          <div className="pt-4 border-t border-charcoal-100 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-600">
              <span>Shipping Fee</span>
              <span className="font-semibold">{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-charcoal-900 pt-2 border-t border-charcoal-100">
              <span>Total Paid</span>
              <span className="text-brand-800 text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Delivery destination */}
          <div className="pt-4 border-t border-charcoal-100 bg-cream-50 p-4 rounded-2xl text-xs text-charcoal-700 space-y-1">
            <span className="font-bold text-charcoal-900 block flex items-center gap-1.5 mb-1">
              <Truck className="w-3.5 h-3.5 text-brand-700" /> Delivery Address
            </span>
            <p className="font-semibold text-charcoal-800">{address.name} ({address.phone})</p>
            <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
            <p>{address.city}, {address.state} - {address.pincode}, India</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
            className="btn-primary py-3.5 px-8 text-sm font-semibold justify-center"
          >
            <Truck className="w-4 h-4" /> Live Order Tracking
          </Link>
          <Link
            href="/shop"
            className="btn-secondary py-3.5 px-8 text-sm font-semibold justify-center bg-white"
          >
            <ArrowRight className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
