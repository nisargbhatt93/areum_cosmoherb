'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Storefront Error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-cream-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-charcoal-100 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Something went wrong
        </h2>
        <p className="text-xs text-charcoal-500">
          {error?.message || 'We encountered an issue while loading this page. Please try again.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link
            href="/"
            className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
