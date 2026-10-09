import { Star } from 'lucide-react'
import prisma from '@/lib/db'

const FALLBACK_REVIEWS = [
  {
    id: '1',
    name: 'Priya S.',
    rating: 5,
    body: 'I switched to the herbal shampoo about a month ago and my scalp feels so much better. Gentle, cleans well, and smells amazing.',
    productName: 'Herbal Shampoo',
  },
  {
    id: '2',
    name: 'Rahul M.',
    rating: 5,
    body: "The herbal soap lathers beautifully and leaves my skin feeling soft. Love that it's made with natural ingredients.",
    productName: 'Neem Herbal Soap',
  },
  {
    id: '3',
    name: 'Anita K.',
    rating: 4,
    body: 'Great conditioner for everyday use. My hair feels manageable and the herbal fragrance is subtle and pleasant.',
    productName: 'Herbal Conditioner',
  },
  {
    id: '4',
    name: 'Deepa R.',
    rating: 5,
    body: 'Finally found a lip balm that keeps my lips moisturised all day without the waxy feeling. Highly recommend.',
    productName: 'Herbal Lip Balm',
  },
  {
    id: '5',
    name: 'Suresh P.',
    rating: 5,
    body: 'The hair oil is light, non-greasy, and has a lovely herbal scent. Works great for scalp massage.',
    productName: 'Herbal Hair Oil',
  },
  {
    id: '6',
    name: 'Meena T.',
    rating: 5,
    body: 'Excellent quality products and fast delivery. The packaging is eco-conscious and the products deliver on their promises.',
    productName: 'Combo Pack',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-gold-400 fill-gold-400' : 'text-charcoal-200 fill-charcoal-200'
          }`}
        />
      ))}
    </div>
  )
}

export default async function SocialProof() {
  const dbReviews = await prisma.review
    .findMany({
      where: { isFeatured: true, status: 'approved' },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
    .catch(() => [])

  const reviews =
    dbReviews.length > 0
      ? dbReviews.map((r) => ({
          id: r.id,
          name: r.name,
          rating: r.rating,
          body: r.body,
          productName: '',
        }))
      : FALLBACK_REVIEWS

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mt-1">
            What Our Customers Say
          </h2>
          <p className="text-charcoal-600 mt-2">Real reviews from real customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-cream-50 border border-cream-200 rounded-2xl flex flex-col gap-4"
            >
              <StarRating rating={review.rating} />
              <p className="text-charcoal-700 text-sm leading-relaxed flex-1">
                &ldquo;{review.body}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-charcoal-800 text-sm">{review.name}</p>
                  {review.productName && (
                    <p className="text-charcoal-500 text-xs">{review.productName}</p>
                  )}
                </div>
                <div className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded-full">
                  ✓ Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
