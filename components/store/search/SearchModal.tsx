'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  category?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const TRENDING_SEARCHES = [
  'Herbal Shampoo',
  'Aloe Vera Soap',
  'Hair Oil',
  'Lip Balm',
  'Herbal Conditioner',
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      setResults([])
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    clearTimeout(timeoutRef.current)
    setIsLoading(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
        const data = await res.json()
        setResults(data.products || [])
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutRef.current)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-charcoal-100">
          <Search className="w-5 h-5 text-charcoal-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, ingredients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-charcoal-800 placeholder-charcoal-400 focus:outline-none text-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-charcoal-400 hover:text-charcoal-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-charcoal-500 border border-charcoal-200 px-2 py-1 rounded font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {!query && (
            <div className="p-5">
              <p className="text-xs text-charcoal-500 font-medium uppercase tracking-wider mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm hover:bg-brand-100 transition-colors"
                  >
                    <TrendingUp className="w-3 h-3" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="px-5 py-8 text-center">
              <div className="inline-block w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-charcoal-500 text-sm">No products found for &ldquo;{query}&rdquo;</p>
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-brand-700 text-sm font-medium mt-2 block hover:underline"
              >
                Browse all products →
              </Link>
            </div>
          )}

          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-3 hover:bg-brand-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-charcoal-100 overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || 'https://placehold.co/48x48/edf7f2/1a3a2a?text=A'}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal-800 line-clamp-1">{product.name}</p>
                {product.category && (
                  <p className="text-xs text-charcoal-500">{product.category}</p>
                )}
              </div>
              <span className="text-sm font-semibold text-brand-700">{formatPrice(product.price)}</span>
            </Link>
          ))}

          {query && results.length > 0 && (
            <div className="border-t border-charcoal-100 p-4">
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-brand-700 text-sm font-medium hover:underline"
              >
                View all results for &ldquo;{query}&rdquo; →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
