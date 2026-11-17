import prisma from '@/lib/db'
import ReviewsClient from './ReviewsClient'

export const metadata = {
  title: 'Moderate Reviews | Areum Cosmoherb Admin',
}

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Customer Reviews & Moderation
        </h1>
        <p className="text-xs text-charcoal-500">Approve, reject, or feature verified customer reviews on the storefront</p>
      </div>

      <ReviewsClient initialReviews={reviews as any} />
    </div>
  )
}
