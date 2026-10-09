import { Leaf, Shield, Heart, Truck } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Leaf,
    title: 'Herbal Formulations',
    desc: 'Made with carefully selected herbal ingredients',
  },
  {
    icon: Shield,
    title: 'No Harsh Chemicals',
    desc: 'Gentle formulas for everyday use',
  },
  {
    icon: Heart,
    title: 'Cruelty Conscious',
    desc: 'Thoughtfully developed personal care',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Free shipping on orders above ₹999',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Safe & encrypted checkout',
  },
]

export default function TrustStrip() {
  return (
    <section className="bg-white border-y border-charcoal-100 py-10">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-800 text-sm">{item.title}</p>
                <p className="text-charcoal-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
