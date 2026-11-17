'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

const FAQS = [
  {
    q: 'Are Areum Cosmoherb products 100% herbal?',
    a: 'Yes, our products are formulated using carefully selected herbal extracts, cold-pressed plant oils, and traditional botanicals. We prioritize safety and avoid harsh chemicals.',
  },
  {
    q: 'How long does delivery take across India?',
    a: 'Standard orders are dispatched within 24-48 hours. Metro cities typically receive deliveries within 3-4 business days, while other regions take 4-6 business days.',
  },
  {
    q: 'Can I pay via Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available across most Indian pincodes for orders up to ₹3,000. A standard ₹40 courier handling fee applies to COD shipments.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes! All orders of ₹999 and above qualify for free standard shipping anywhere in India.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns on unopened and sealed items reported within 7 days of delivery. If an item arrives damaged, please reach out to our team immediately with photos for a replacement.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      toast.success('Thank you! Your message has been received. Our team will get back to you within 24 hours.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="container-custom max-w-5xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            We&apos;re Here to Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Contact Areum Cosmoherb
          </h1>
          <p className="text-sm text-charcoal-600">
            Have questions about our herbal formulations, tracking an order, or need product recommendations? Reach out to our herbal care experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-6">
              <h2 className="text-lg font-bold text-charcoal-900 border-b border-charcoal-100 pb-3">
                Direct Contact
              </h2>

              <div className="space-y-4 text-sm text-charcoal-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-charcoal-400 block font-semibold">Email Us</span>
                    <a href="mailto:care@areumcosmoherb.com" className="font-bold text-brand-800 hover:underline">
                      care@areumcosmoherb.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-charcoal-400 block font-semibold">Call or WhatsApp</span>
                    <a href="tel:+919876543210" className="font-bold text-charcoal-900 hover:text-brand-800">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-charcoal-400 block font-semibold">Business Hours</span>
                    <p className="text-xs text-charcoal-600">Mon – Sat: 9:30 AM – 6:30 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-charcoal-400 block font-semibold">Registered Office</span>
                    <p className="text-xs text-charcoal-600">Areum Cosmoherb Labs, Indiranagar, Bengaluru, Karnataka, India - 560038</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Areum%20Cosmoherb,%20I%20have%20an%20inquiry%20regarding%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-6">
            <h2 className="text-lg font-bold text-charcoal-900 border-b border-charcoal-100 pb-3">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aditi Sharma"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-600 block mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Question about Kesh Shampoo"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-600 block mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today?"
                  className="input-field text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn-primary w-full py-3.5 text-xs font-bold shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-100 shadow-2xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-charcoal-500">Quick answers about our formulations, orders, and delivery</p>
          </div>

          <div className="divide-y divide-charcoal-100 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-charcoal-900 hover:text-brand-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-charcoal-400 transition-transform ${isOpen ? 'rotate-180 text-brand-700' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-charcoal-600 mt-2 leading-relaxed animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
