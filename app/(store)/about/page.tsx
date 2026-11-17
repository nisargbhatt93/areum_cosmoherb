import Image from 'next/image'
import Link from 'next/link'
import { Leaf, ShieldCheck, Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Our Story & Herbal Philosophy | Areum Cosmoherb',
  description: 'Learn about Areum Cosmoherb — thoughtfully crafted personal care inspired by herbal traditions and modern beauty.',
}

export default function AboutPage() {
  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container-custom max-w-5xl space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Our Brand Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal-900 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Herbal Wisdom, Crafted for Everyday Beauty
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
            Areum Cosmoherb was founded with a simple, honest conviction: personal care shouldn&apos;t compromise on safety, purity, or everyday efficacy.
          </p>
        </div>

        {/* Visual Story Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-charcoal-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-brand-50">
            <Image
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
              alt="Herbal botanicals in preparation"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Inspired By Tradition
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              A Responsible Approach to Personal Care
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              We draw inspiration from time-honored Indian herbal heritage — using ingredients like Amla, Bhringraj, Shikakai, Neem, and pure Aloe Vera — carefully extracted and formulated to fit seamlessly into fast-paced contemporary lifestyles.
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              We reject exaggerated medical claims and unrealistic promises. Instead, we focus on genuine botanical benefits, gentle everyday formulations, and ingredient transparency.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-800">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-charcoal-900">Carefully Selected Botanicals</h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Every plant extract is sourced responsibly from trusted growers, verified for natural purity and batch integrity.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-charcoal-900">No Harsh Formulations</h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Created without aggressive stripping agents, harsh parabens, or synthetic dyes. Balanced for everyday comfort.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-charcoal-100 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-800">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-charcoal-900">Cruelty-Conscious</h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                We believe beauty should be kind. Our formulations are tested responsibly without animal cruelty at any phase.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-brand-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Experience Authentic Herbal Care
          </h2>
          <p className="text-sm text-brand-200 max-w-xl mx-auto">
            Find the right routine for your hair and skin care with our carefully formulated herbal collections.
          </p>
          <Link href="/shop" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 inline-flex items-center gap-2">
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
