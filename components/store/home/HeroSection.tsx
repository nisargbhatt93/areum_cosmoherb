'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
          className="w-full h-full"
        />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-sage-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl" />

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-brand-700/50 border border-brand-500/30 text-brand-200 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-brand-300 rounded-full" />
            Natural Herbal Personal Care
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Herbal Care,
            <br />
            <span className="text-brand-300 italic">Made for</span>
            <br />
            Everyday You.
          </h1>

          {/* Subheading */}
          <p className="text-brand-200 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Thoughtfully crafted personal care inspired by herbal traditions and modern beauty.
            Formulated without harsh chemicals.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?sort=bestselling"
              className="inline-flex items-center gap-2 border-2 border-brand-400 text-brand-100 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-700 transition-all duration-200"
            >
              Explore Best Sellers
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-brand-700/50">
            {[
              { value: 'Natural', label: 'Ingredients' },
              { value: '10,000+', label: 'Happy Customers' },
              { value: 'No', label: 'Harsh Chemicals' },
              { value: 'Cruelty', label: 'Conscious' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </p>
                <p className="text-brand-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-brand-300" />
      </div>
    </section>
  )
}
