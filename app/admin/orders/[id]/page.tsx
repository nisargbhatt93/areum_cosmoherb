import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import OrderDetailClient from './OrderDetailClient'

export const dynamic = 'force-dynamic'

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
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
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-charcoal-500">Manage fulfillment, courier partner, and payment status</p>
        </div>

        <Link
          href={`/track-order?orderNumber=${order.orderNumber}`}
          target="_blank"
          className="btn-secondary text-xs py-2 px-4 bg-white self-start sm:self-auto"
        >
          View Customer Tracking View ↗
        </Link>
      </div>

      <OrderDetailClient order={order as any} />
    </div>
  )
}
