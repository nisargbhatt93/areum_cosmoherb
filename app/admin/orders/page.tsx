import Link from 'next/link'
import prisma from '@/lib/db'
import { formatPrice, formatDate } from '@/lib/utils'
import { ShoppingBag, Eye, Truck, CheckCircle2 } from 'lucide-react'

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>
}

export const metadata = {
  title: 'Manage Orders | Areum Cosmoherb Admin',
}

export const dynamic = 'force-dynamic'

const TABS = [
  { label: 'All Orders', status: '' },
  { label: 'Pending', status: 'pending' },
  { label: 'Processing', status: 'processing' },
  { label: 'Packed', status: 'packed' },
  { label: 'Shipped', status: 'shipped' },
  { label: 'Delivered', status: 'delivered' },
  { label: 'Cancelled', status: 'cancelled' },
]

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams

  const where: any = {}
  if (status) {
    where.status = status
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Customer Orders ({orders.length})
        </h1>
        <p className="text-xs text-charcoal-500">Track and fulfill customer orders and logistics</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = (tab.status === '' && !status) || status === tab.status
          return (
            <Link
              key={tab.label}
              href={tab.status ? `/admin/orders?status=${tab.status}` : '/admin/orders'}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white text-charcoal-700 hover:bg-cream-100 border border-charcoal-100'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <ShoppingBag className="w-10 h-10 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-charcoal-900 text-sm">No Orders in this Status</h3>
            <p className="text-xs text-charcoal-500">Select another tab to view other customer orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order #</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Fulfillment</th>
                  <th className="p-3.5 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-charcoal-900">{order.orderNumber}</td>
                    <td className="p-3.5 font-semibold text-charcoal-800">
                      {order.guestName || 'Registered User'}
                    </td>
                    <td className="p-3.5">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="p-3.5 text-charcoal-500">{formatDate(order.createdAt)}</td>
                    <td className="p-3.5 font-extrabold text-brand-800">{formatPrice(order.total)}</td>
                    <td className="p-3.5 uppercase font-bold text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full ${
                        order.paymentStatus === 'completed'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-brand-50 text-brand-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn-secondary text-[11px] py-1.5 px-3 bg-white inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
