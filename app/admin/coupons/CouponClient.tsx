'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tag, Plus, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface CouponItem {
  id: string
  code: string
  description?: string | null
  type: string
  value: number
  maxDiscount?: number | null
  minOrderAmount: number
  usageCount: number
  usageLimit?: number | null
  startDate: Date | string
  expiryDate: Date | string
  isActive: boolean
}

export default function CouponClient({ initialCoupons }: { initialCoupons: CouponItem[] }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '15',
    maxDiscount: '300',
    minOrderAmount: '799',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    usageLimit: '500',
    isFirstOrderOnly: false,
    isActive: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.value) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
          minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon')

      toast.success(`Coupon code ${formData.code.toUpperCase()} created successfully!`)
      setShowModal(false)
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: '15',
        maxDiscount: '300',
        minOrderAmount: '799',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        usageLimit: '500',
        isFirstOrderOnly: false,
        isActive: true,
      })
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create coupon.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon Code
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Coupon Code</th>
                <th className="p-3.5">Discount</th>
                <th className="p-3.5">Min Order</th>
                <th className="p-3.5">Redeemed</th>
                <th className="p-3.5">Valid Till</th>
                <th className="p-3.5 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {initialCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold font-mono text-charcoal-900 bg-brand-50 px-2 py-0.5 rounded-md">
                        {c.code}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(c.code)
                          toast.success(`Copied ${c.code}`)
                        }}
                        className="text-charcoal-400 hover:text-charcoal-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {c.description && <p className="text-[10px] text-charcoal-400 mt-0.5">{c.description}</p>}
                  </td>

                  <td className="p-3.5 font-bold text-brand-800">
                    {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    {c.maxDiscount && <span className="text-[10px] text-charcoal-400 block">Up to ₹{c.maxDiscount}</span>}
                  </td>

                  <td className="p-3.5 font-medium">₹{c.minOrderAmount}</td>

                  <td className="p-3.5">
                    <span className="font-bold">{c.usageCount}</span>
                    <span className="text-charcoal-400 text-[10px]"> / {c.usageLimit || '∞'}</span>
                  </td>

                  <td className="p-3.5 text-charcoal-500">{formatDate(c.expiryDate)}</td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.isActive ? 'bg-green-100 text-green-800' : 'bg-charcoal-100 text-charcoal-600'
                    }`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal create */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-charcoal-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-charcoal-900">Create New Promotion Coupon</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. HERBAL20"
                    className="input-field text-sm uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Discount Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-600 block mb-1">Short Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. 15% off festive monsoon herbal care"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Valid Until</label>
                  <input
                    type="date"
                    required
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs py-2 px-4 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs py-2 px-5 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
