import prisma from '@/lib/db'
import CouponClient from './CouponClient'

export const metadata = {
  title: 'Coupon & Promotion Management | Areum Cosmoherb Admin',
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Promotion & Coupon Management
        </h1>
        <p className="text-xs text-charcoal-500">Configure promotional discount codes, spend thresholds, and usage limits</p>
      </div>

      <CouponClient initialCoupons={coupons as any} />
    </div>
  )
}
