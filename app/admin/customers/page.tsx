import prisma from '@/lib/db'
import { formatPrice, formatDate } from '@/lib/utils'
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react'

export const metadata = {
  title: 'Customer Directory | Areum Cosmoherb Admin',
}

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'customer' },
    include: {
      orders: {
        select: { id: true, total: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
      addresses: {
        where: { isDefault: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Registered Customers ({customers.length})
        </h1>
        <p className="text-xs text-charcoal-500">Customer profiles, order frequency, and lifetime transaction value</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Users className="w-10 h-10 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-charcoal-900 text-sm">No Registered Customers Yet</h3>
            <p className="text-xs text-charcoal-500">Customer accounts will be listed here after sign up.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Customer</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Total Orders</th>
                  <th className="p-3.5">Lifetime Value (LTV)</th>
                  <th className="p-3.5">Last Order</th>
                  <th className="p-3.5 rounded-r-xl">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {customers.map((c) => {
                  const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0)
                  const lastOrder = c.orders[0]
                  return (
                    <tr key={c.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-charcoal-900 block">{c.name || 'Anonymous User'}</span>
                            {c.addresses[0] && (
                              <span className="text-[10px] text-charcoal-400">
                                {c.addresses[0].city}, {c.addresses[0].state}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-charcoal-700">
                          <Mail className="w-3 h-3 text-charcoal-400" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-charcoal-500 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-charcoal-400" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 font-bold">
                        {c.orders.length} {c.orders.length === 1 ? 'order' : 'orders'}
                      </td>

                      <td className="p-3.5 font-extrabold text-sm text-brand-800">
                        {formatPrice(totalSpent)}
                      </td>

                      <td className="p-3.5 text-charcoal-500">
                        {lastOrder ? formatDate(lastOrder.createdAt) : 'No orders yet'}
                      </td>

                      <td className="p-3.5 text-charcoal-400">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
