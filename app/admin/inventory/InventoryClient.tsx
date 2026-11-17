'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Boxes, Plus, Minus, AlertTriangle, CheckCircle2, History } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface InventoryProduct {
  id: string
  name: string
  sku: string
  stock: number
  lowStockThreshold: number
  category: { name: string }
  inventoryTxns: Array<{
    id: string
    type: string
    quantity: number
    reason?: string | null
    createdAt: Date | string
  }>
}

export default function InventoryClient({ products }: { products: InventoryProduct[] }) {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null)
  const [adjustQty, setAdjustQty] = useState('10')
  const [reason, setReason] = useState('New batch lab restocking')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          adjustment: parseInt(adjustQty),
          reason,
        }),
      })

      if (!res.ok) throw new Error('Failed to adjust')

      toast.success(`Inventory updated for ${selectedProduct.name}`)
      setSelectedProduct(null)
      router.refresh()
    } catch {
      toast.error('Failed to update inventory.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length

  return (
    <div className="space-y-6">
      {/* Alert strip */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>{lowStockCount}</strong> {lowStockCount === 1 ? 'product is' : 'products are'} currently below their safe threshold level.
            </span>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Safe Threshold</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {products.map((p) => {
                const isOut = p.stock === 0
                const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold
                return (
                  <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-charcoal-900 max-w-xs truncate">{p.name}</td>
                    <td className="p-3.5 text-charcoal-600">{p.category.name}</td>
                    <td className="p-3.5 font-mono text-[10px] text-charcoal-500">{p.sku}</td>
                    <td className="p-3.5 font-extrabold text-sm text-charcoal-900">{p.stock}</td>
                    <td className="p-3.5 text-charcoal-500">{p.lowStockThreshold}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isOut ? 'bg-red-100 text-red-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="btn-secondary text-[11px] py-1 px-3 bg-white hover:bg-brand-50"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal / Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-charcoal-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-charcoal-900">
              Adjust Stock: {selectedProduct.name}
            </h3>
            <p className="text-xs text-charcoal-500">Current available stock: <strong>{selectedProduct.stock} units</strong></p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-charcoal-600 block mb-1">
                  Stock Change (+ for restock, - for reduction)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    placeholder="e.g. 20 or -5"
                    className="input-field text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustQty('25')}
                    className="btn-secondary text-xs px-3 bg-white whitespace-nowrap"
                  >
                    +25
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustQty('50')}
                    className="btn-secondary text-xs px-3 bg-white whitespace-nowrap"
                  >
                    +50
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-600 block mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Batch restocking, Damaged unit write-off"
                  className="input-field text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="btn-secondary text-xs py-2 px-4 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs py-2 px-5 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Save Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
