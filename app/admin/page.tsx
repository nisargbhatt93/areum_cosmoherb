import Link from 'next/link'
import prisma from '@/lib/db'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  Package,
  ArrowRight,
  Plus,
} from 'lucide-react'

export const metadata = {
  title: 'Operations Dashboard | Areum Cosmoherb Admin',
}

export default async function AdminDashboardPage() {
  // 1. Fetch live metrics from database
  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    completedOrders,
    totalProducts,
    lowStockProducts,
    totalCustomers,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.count().catch(() => 0),
    prisma.order.count({ where: { status: 'pending' } }).catch(() => 0),
    prisma.order.count({ where: { status: 'delivered' } }).catch(() => 0),
    prisma.order.count({ where: { status: 'cancelled' } }).catch(() => 0),
    prisma.order.findMany({
      where: { status: { not: 'cancelled' } },
      select: { total: true },
    }).catch(() => []),
    prisma.product.count({ where: { status: 'active' } }).catch(() => 0),
    prisma.product.findMany({
      where: { stock: { lte: 10 }, status: 'active' },
      take: 5,
      orderBy: { stock: 'asc' },
    }).catch(() => []),
    prisma.user.count({ where: { role: 'customer' } }).catch(() => 0),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
    prisma.product.findMany({
      where: { isBestSeller: true, status: 'active' },
      take: 5,
      include: { category: { select: { name: true } } },
    }).catch(() => []),
  ])

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Overview & Operations
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">Live metrics from Areum Cosmoherb e-commerce engine</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Add New Product
          </Link>
          <Link href="/admin/orders" className="btn-secondary text-xs py-2 px-4 bg-white flex items-center gap-1.5">
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-charcoal-900">{formatPrice(totalRevenue)}</span>
            <p className="text-[11px] text-green-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Live Gross Volume
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">All Orders</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-charcoal-900">{totalOrders}</span>
            <p className="text-[11px] text-charcoal-500 mt-1">
              {pendingOrders} awaiting fulfillment
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Average Order (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-charcoal-900">{formatPrice(averageOrderValue)}</span>
            <p className="text-[11px] text-charcoal-500 mt-1">
              Threshold: ₹999 free shipping
            </p>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-charcoal-900">{totalCustomers}</span>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">
              Active Registered Accounts
            </p>
          </div>
        </div>
      </div>

      {/* Stock Alerts & Order Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Warning Alert */}
        <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
            <h2 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Stock Level Alerts
            </h2>
            <Link href="/admin/inventory" className="text-xs font-bold text-brand-700 hover:underline">
              Inventory →
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-charcoal-500 py-4 text-center">All products are healthy above low stock thresholds.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs">
                  <div>
                    <span className="font-bold text-charcoal-900 block line-clamp-1">{p.name}</span>
                    <span className="text-charcoal-500 font-mono text-[10px]">SKU: {p.sku}</span>
                  </div>
                  <span className={`font-black px-2.5 py-1 rounded-full text-xs ${
                    p.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Fulfillment Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
            <h2 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-700" /> Order Fulfillment Status
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-brand-700 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center py-2">
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100">
              <span className="text-2xl font-black text-brand-800 block">{pendingOrders}</span>
              <span className="text-xs font-semibold text-brand-700">Pending</span>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
              <span className="text-2xl font-black text-green-800 block">{deliveredOrders}</span>
              <span className="text-xs font-semibold text-green-700">Delivered</span>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <span className="text-2xl font-black text-red-800 block">{cancelledOrders}</span>
              <span className="text-xs font-semibold text-red-700">Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              Recent Orders
            </h2>
            <p className="text-xs text-charcoal-500">Live order activity across India</p>
          </div>
          <Link href="/admin/orders" className="btn-secondary text-xs py-1.5 px-3 bg-white">
            See All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-charcoal-500 py-6 text-center">No orders have been placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order Number</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-charcoal-900">{order.orderNumber}</td>
                    <td className="p-3.5">{order.guestName || 'Registered User'}</td>
                    <td className="p-3.5 text-charcoal-500">{formatDate(order.createdAt)}</td>
                    <td className="p-3.5 font-extrabold text-brand-800">{formatPrice(order.total)}</td>
                    <td className="p-3.5 uppercase font-semibold text-[11px]">{order.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-brand-700 hover:text-brand-800 font-bold hover:underline"
                      >
                        Manage →
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
