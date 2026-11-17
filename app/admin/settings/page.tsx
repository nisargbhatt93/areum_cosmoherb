import prisma from '@/lib/db'
import SettingsClient from './SettingsClient'

export const metadata = {
  title: 'Store Settings | Areum Cosmoherb Admin',
}

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  let settingsRecords: any[] = []
  try {
    settingsRecords = await prisma.storeSettings.findMany()
  } catch (err) {
    console.error('[AdminSettingsPage Error]', err)
  }
  const settingsMap: Record<string, string> = {
    store_name: 'Areum Cosmoherb',
    free_shipping_threshold: '999',
    base_shipping_fee: '60',
    cod_fee: '40',
    cod_enabled: 'true',
    support_email: 'care@areumcosmoherb.com',
    support_phone: '+91 98765 43210',
    announcement_bar: 'Free Shipping on Orders Above ₹999 | Use code AREUM10',
  }

  settingsRecords.forEach((s) => {
    settingsMap[s.key] = s.value
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Store Settings & Configuration
        </h1>
        <p className="text-xs text-charcoal-500">Configure global business rules, shipping thresholds, and contact information</p>
      </div>

      <SettingsClient initialSettings={settingsMap} />
    </div>
  )
}
