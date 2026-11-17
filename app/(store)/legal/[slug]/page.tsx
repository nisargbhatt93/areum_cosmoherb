import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

interface LegalPageProps {
  params: Promise<{ slug: string }>
}

const LEGAL_DOCS: Record<string, { title: string; lastUpdated: string; content: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'September 2026',
    content: [
      'At Areum Cosmoherb, we are committed to protecting and respecting your personal privacy. This Privacy Policy explains how we collect, use, process, and safeguard your personal data when you visit our website or make a purchase.',
      '1. Information We Collect: We collect information provided directly by you when creating an account, subscribing to newsletters, placing orders, or contacting support. This includes your name, delivery address, phone number, and email address.',
      '2. Payment Security: All payment transactions are processed through encrypted payment gateways (e.g., Razorpay) adhering to PCI-DSS standards. We never store credit card numbers, CVVs, or bank passwords on our servers.',
      '3. How We Use Information: We use customer information to process orders, arrange shipping and courier notifications, provide customer support, and communicate promotional offers (only with prior consent).',
      '4. Third-Party Sharing: We share necessary shipping details with logistics partners solely to deliver your orders. We do not sell, rent, or trade your personal information with external advertisers.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: 'September 2026',
    content: [
      'Welcome to Areum Cosmoherb. By accessing or using our website, services, and purchasing products, you agree to be bound by the terms and conditions outlined below.',
      '1. Product Information: We take great care to ensure accurate descriptions, prices, and stock status. We formulate products using herbal and natural botanicals. Product effectiveness can vary depending on individual skin and hair types.',
      '2. Medical Disclaimer: Our products are cosmetics and personal care formulations for everyday grooming. Statements made regarding natural botanical ingredients are not intended to diagnose, treat, cure, or prevent any medical disease. Always perform a patch test before first use.',
      '3. Pricing and Payments: All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to correct typographical pricing errors before order processing.',
      '4. Intellectual Property: The brand name "Areum Cosmoherb", logos, packaging designs, product descriptions, and graphics are the intellectual property of Areum Cosmoherb and protected by trademark and copyright laws.',
    ],
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    lastUpdated: 'September 2026',
    content: [
      'Areum Cosmoherb delivers across all serviceable pincodes in India through premier domestic logistics partners including Blue Dart, Delhivery, and India Post.',
      '1. Free Shipping: We offer Free Standard Shipping on all prepaid and COD orders of value ₹999 and above.',
      '2. Dispatch Timeline: Orders are packaged and dispatched from our herbal facility within 24 to 48 hours of order confirmation (excluding Sundays and national holidays).',
      '3. Delivery Timeframes: Major metropolitan cities usually receive deliveries within 3-4 working days. Non-metro and regional locations typically take 4-6 working days.',
      '4. Tracking: Once dispatched, an AWB tracking number and live tracking link are automatically generated and viewable in your Account and on our Track Order page.',
    ],
  },
  returns: {
    title: 'Return & Refund Policy',
    lastUpdated: 'September 2026',
    content: [
      'We stand firmly behind the quality and purity of our herbal personal care formulations.',
      '1. Return Window: Due to hygiene considerations for personal care items, we accept returns on unopened, unused products in original packaging reported within 7 days of delivery.',
      '2. Damaged or Incorrect Items: If your package arrives leaked, broken, or with an incorrect product, notify our care team at care@areumcosmoherb.com with unboxing photos within 48 hours. We will arrange a free immediate replacement.',
      '3. Refunds: Approved refunds for prepaid orders are credited back to the original payment source (UPI/Card/Bank) within 5-7 business days of warehouse receipt.',
    ],
  },
  cancellation: {
    title: 'Cancellation Policy',
    lastUpdated: 'September 2026',
    content: [
      '1. Pre-Dispatch Cancellation: You may cancel your order free of charge before the order is marked as "Shipped" by contacting our customer care via WhatsApp or email with your Order Number.',
      '2. Post-Dispatch: Once an order has been handed over to the courier partner, cancellations cannot be processed immediately. You may reject the delivery when attempted by the courier.',
      '3. Refund Timeline: Any cancelled prepaid orders will be refunded back to your original source within 3-5 working days.',
    ],
  },
}

export async function generateMetadata({ params }: LegalPageProps) {
  const { slug } = await params
  const doc = LEGAL_DOCS[slug]
  if (!doc) return { title: 'Legal Information' }
  return { title: `${doc.title} | Areum Cosmoherb` }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params
  const doc = LEGAL_DOCS[slug]

  if (!doc) {
    notFound()
  }

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container-custom max-w-3xl space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-charcoal-100 shadow-sm space-y-6">
          <div className="border-b border-charcoal-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full inline-block mb-3">
              Official Policy
            </span>
            <h1 className="text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              {doc.title}
            </h1>
            <p className="text-xs text-charcoal-400 mt-1">Last Updated: {doc.lastUpdated}</p>
          </div>

          <div className="space-y-4 text-sm text-charcoal-700 leading-relaxed">
            {doc.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-charcoal-100 text-xs text-charcoal-500">
            For specific policy questions or inquiries, please contact{' '}
            <a href="mailto:care@areumcosmoherb.com" className="font-bold text-brand-700 hover:underline">
              care@areumcosmoherb.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
