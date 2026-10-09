import Link from 'next/link'
import { Truck, ArrowRight } from 'lucide-react'

export default function FreeShippingBanner() {
  return (
    <section className="bg-brand-700 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Free Shipping on All Orders Above ₹999</p>
              <p className="text-brand-200 text-sm">
                Fast delivery across India. No minimum for first orders with code AREUM10.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
