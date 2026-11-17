'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, CheckCircle, XCircle, Trash2, Sparkles, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface ReviewData {
  id: string
  name: string
  rating: number
  title?: string | null
  body: string
  status: string
  isVerified: boolean
  isFeatured: boolean
  createdAt: Date | string
  product: { name: string; slug: string }
}

export default function ReviewsClient({ initialReviews }: { initialReviews: ReviewData[] }) {
  const router = useRouter()
  const [reviews, setReviews] = useState(initialReviews)

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      )
      toast.success(`Review ${newStatus}!`)
    } catch {
      toast.error('Failed to update review status.')
    }
  }

  const handleToggleFeature = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !current }),
      })
      if (!res.ok) throw new Error('Update failed')

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isFeatured: !current } : r))
      )
      toast.success(!current ? 'Marked as featured on homepage!' : 'Removed from featured.')
    } catch {
      toast.error('Failed to update featured flag.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')

      setReviews((prev) => prev.filter((r) => r.id !== id))
      toast.success('Review deleted.')
    } catch {
      toast.error('Failed to delete review.')
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs overflow-hidden">
      {reviews.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <MessageSquare className="w-10 h-10 text-charcoal-300 mx-auto" />
          <h3 className="font-bold text-charcoal-900 text-sm">No Reviews Submitted</h3>
          <p className="text-xs text-charcoal-500">Customer feedback will show up here for moderation.</p>
        </div>
      ) : (
        <div className="divide-y divide-charcoal-100 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal-900">{r.name}</span>
                    {r.isVerified && (
                      <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Verified Purchase
                      </span>
                    )}
                    <span className="text-[11px] text-charcoal-400">• {formatDate(r.createdAt)}</span>
                  </div>
                  <p className="text-xs text-brand-800 font-semibold mt-0.5">Product: {r.product.name}</p>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : r.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>

                  {r.isFeatured && (
                    <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Stars & Body */}
              <div className="space-y-1">
                <div className="flex text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold-500' : 'text-charcoal-200 fill-charcoal-200'}`}
                    />
                  ))}
                </div>
                {r.title && <h4 className="text-xs font-bold text-charcoal-900">{r.title}</h4>}
                <p className="text-xs text-charcoal-600 leading-relaxed">&ldquo;{r.body}&rdquo;</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex gap-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(r.id, 'approved')}
                      className="btn-primary text-[11px] py-1 px-3 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(r.id, 'rejected')}
                      className="btn-secondary text-[11px] py-1 px-3 text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleFeature(r.id, r.isFeatured)}
                    className="btn-secondary text-[11px] py-1 px-3 bg-white hover:bg-gold-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-gold-500" /> {r.isFeatured ? 'Unfeature' : 'Feature on Home'}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-charcoal-400 hover:text-red-500 rounded-lg"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
