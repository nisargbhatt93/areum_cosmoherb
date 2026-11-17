import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-400/60 shadow-md flex-shrink-0 bg-brand-900">
                <Image
                  src="/logo.jpg"
                  alt="Areum Cosmoherb Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="leading-tight">
                <span
                  className="block text-white font-bold text-xl tracking-wider leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  AREUM
                </span>
                <span className="block text-brand-300 text-[9px] tracking-wider uppercase font-semibold leading-none mt-1">
                  Where Nature Creates Beauty
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
                className="w-9 h-9 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors text-brand-200 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors text-brand-200 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 bg-brand-800 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors text-brand-200 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
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
                { label: 'My Orders', href: '/account' },
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
                  href="mailto:care@areumcosmoherb.com"
                  className="flex items-start gap-2 text-brand-300 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  care@areumcosmoherb.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-start gap-2 text-brand-300 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-brand-300 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Bengaluru, India</span>
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
