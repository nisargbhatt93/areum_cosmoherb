'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, LayoutDashboard } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Panel Error:', error)
  }, [error])

  return (
    <div className="bg-white rounded-3xl p-8 border border-charcoal-100 shadow-sm text-center space-y-4 my-6">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
        Unable to load section
      </h2>
      <p className="text-xs text-charcoal-500 max-w-md mx-auto">
        {error?.message || 'An error occurred while communicating with the database or server. Please refresh or retry.'}
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retry
        </button>
        <Link
          href="/admin"
          className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
        </Link>
      </div>
    </div>
  )
}
