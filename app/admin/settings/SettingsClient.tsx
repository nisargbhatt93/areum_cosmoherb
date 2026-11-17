'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setSettings((prev) => ({ ...prev, [name]: String(checked) }))
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      toast.success('Store settings saved successfully!')
      router.refresh()
    } catch {
      toast.error('Failed to update store settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand & Contact */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Brand & Communication</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Store Name</label>
            <input
              type="text"
              name="store_name"
              value={settings.store_name || ''}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Support Email</label>
            <input
              type="email"
              name="support_email"
              value={settings.support_email || ''}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Customer Support Phone</label>
            <input
              type="text"
              name="support_phone"
              value={settings.support_phone || ''}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Announcement Bar Text</label>
            <input
              type="text"
              name="announcement_bar"
              value={settings.announcement_bar || ''}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Shipping & Payment Rules */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-charcoal-900 border-b border-charcoal-100 pb-3">Shipping & Payment Rules</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              name="free_shipping_threshold"
              value={settings.free_shipping_threshold || '999'}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Standard Shipping Fee (₹)</label>
            <input
              type="number"
              name="base_shipping_fee"
              value={settings.base_shipping_fee || '60'}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">COD Courier Handling Fee (₹)</label>
            <input
              type="number"
              name="cod_fee"
              value={settings.cod_fee || '40'}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-charcoal-800 cursor-pointer">
            <input
              type="checkbox"
              name="cod_enabled"
              checked={settings.cod_enabled === 'true'}
              onChange={handleChange}
              className="rounded text-brand-700"
            />
            Enable Cash on Delivery (COD) as an active checkout payment option
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-3 px-8 shadow-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
