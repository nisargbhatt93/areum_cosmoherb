'use client'

import { useState } from 'react'
import { Star, CheckCircle, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface ReviewItem {
  id: string
  name: string
  rating: number
  title?: string | null
  body: string
  createdAt: Date | string
  isVerified: boolean
}

interface ProductReviewsProps {
  productId: string
  reviews: ReviewItem[]
}

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !body.trim()) {
      toast.error('Please enter your name and review.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, name, email, title, body }),
      })

      if (!res.ok) throw new Error('Submission failed')

      toast.success('Thank you! Your review has been submitted for approval.')
      setShowReviewForm(false)
      setName('')
      setEmail('')
      setTitle('')
      setBody('')
    } catch {
      toast.error('Could not submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-100 shadow-sm space-y-8">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Customer Feedback & Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-gold-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-gold-500' : 'text-charcoal-200 fill-charcoal-200'}`}
                />
              ))}
            </div>
            <span className="font-bold text-sm text-charcoal-800">{avgRating} out of 5</span>
            <span className="text-xs text-charcoal-500">({reviews.length} reviews)</span>
          </div>
        </div>

        <button
          onClick={() => setShowReviewForm((prev) => !prev)}
          className="btn-secondary text-xs self-start sm:self-auto py-2.5 px-4"
        >
          <MessageSquare className="w-3.5 h-3.5" /> {showReviewForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-cream-50 rounded-2xl border border-cream-200 space-y-4">
          <h4 className="font-bold text-charcoal-900 text-sm">Share Your Experience</h4>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating ? 'text-gold-500 fill-gold-500' : 'text-charcoal-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal-600 block mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Review Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Loved the gentle texture and herbal aroma"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Your Review *</label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell us how this product worked for your routine..."
              className="input-field text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-xs py-2.5 px-6 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-charcoal-500 text-sm">
          No reviews yet for this product. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-charcoal-100">
          {reviews.map((r) => (
            <div key={r.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold-500' : 'text-charcoal-200 fill-charcoal-200'}`}
                      />
                    ))}
                  </div>
                  {r.title && <h5 className="font-bold text-charcoal-900 text-sm">{r.title}</h5>}
                </div>
                <span className="text-[11px] text-charcoal-400">{formatDate(r.createdAt)}</span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">{r.body}</p>

              <div className="flex items-center gap-2 text-xs text-charcoal-500">
                <span className="font-medium text-charcoal-800">{r.name}</span>
                {r.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
