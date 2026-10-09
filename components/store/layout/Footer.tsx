import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <span
                  className="block text-white font-bold text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Areum
                </span>
                <span className="block text-brand-300 text-xs tracking-widest uppercase">
                  Cosmoherb
                </span>
              </div>
            </Link>
            <p className="text-brand-200 text-sm leading-relaxed mb-6">
              Thoughtfully crafted personal care inspired by herbal traditions and modern beauty.
              Made with carefully selected natural ingredients.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Hair Care', href: '/category/hair-care' },
                { label: 'Skin Care', href: '/category/skin-care' },
                { label: 'Bath & Body', href: '/category/bath-body' },
                { label: 'Best Sellers', href: '/shop?sort=bestselling' },
                { label: 'New Arrivals', href: '/shop?sort=newest' },
                { label: 'Combo Packs', href: '/category/combo-packs' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-brand-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Help</h4>
            <ul className="space-y-3">
              {[
                { label: 'Track Order', href: '/track-order' },
                { label: 'My Account', href: '/account' },
                { label: 'My Orders', href: '/account/orders' },
                { label: 'Return Policy', href: '/legal/returns' },
                { label: 'Shipping Policy', href: '/legal/shipping' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-brand-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@areumcosmoherb.com"
                  className="flex items-start gap-2 text-brand-300 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  hello@areumcosmoherb.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="flex items-start gap-2 text-brand-300 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  +91 12345 67890
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-brand-300 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>India</span>
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-brand-200 mb-3">Get 10% off your first order</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-brand-800 border border-brand-700 rounded-lg text-sm text-white placeholder-brand-400 focus:outline-none focus:border-brand-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brand-400 text-sm">
              © {new Date().getFullYear()} Areum Cosmoherb. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { label: 'Privacy Policy', href: '/legal/privacy' },
                { label: 'Terms & Conditions', href: '/legal/terms' },
                { label: 'Cancellation Policy', href: '/legal/cancellation' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-brand-400 hover:text-brand-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
