'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Heart, Search, User, Menu, X, ChevronDown, Leaf } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import CartDrawer from '../cart/CartDrawer'
import SearchModal from '../search/SearchModal'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  {
    label: 'Categories',
    href: '#',
    children: [
      { label: 'Hair Care', href: '/category/hair-care' },
      { label: 'Skin Care', href: '/category/skin-care' },
      { label: 'Bath & Body', href: '/category/bath-body' },
      { label: 'Lip Care', href: '/category/lip-care' },
      { label: 'Hair Color', href: '/category/hair-color' },
      { label: 'Combo Packs', href: '/category/combo-packs' },
    ],
  },
  { label: 'Best Sellers', href: '/shop?sort=bestselling' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-800 text-white text-center py-2 text-sm font-medium px-4">
        <span>🌿 Free Shipping on Orders Above ₹999 | Use code </span>
        <strong>AREUM10</strong>
        <span> for 10% off your first order</span>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-cream-50 border-b border-charcoal-100 transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <span
                  className="block text-brand-800 font-bold text-lg leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Areum
                </span>
                <span className="block text-brand-600 text-xs tracking-widest uppercase leading-none">
                  Cosmoherb
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-charcoal-700 hover:text-brand-700 font-medium text-sm transition-colors rounded-lg hover:bg-brand-50">
                      {link.label}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 pt-1 w-48 z-50">
                        <div className="bg-white rounded-xl shadow-lg border border-charcoal-100 py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-charcoal-700 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-charcoal-700 hover:text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-charcoal-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/account"
                className="p-2 text-charcoal-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors hidden md:flex"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/account/wishlist"
                className="relative p-2 text-charcoal-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors hidden md:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-charcoal-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal-600 hover:text-brand-700 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-charcoal-100 bg-white">
            <div className="container-custom py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href === '#' ? '/shop' : link.href}
                    className="block px-4 py-3 text-charcoal-700 font-medium rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 space-y-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-charcoal-600 hover:text-brand-700 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-charcoal-100 flex gap-4 px-4">
                <Link href="/account" className="flex items-center gap-2 text-charcoal-600 hover:text-brand-700">
                  <User className="w-4 h-4" /> Account
                </Link>
                <Link href="/account/wishlist" className="flex items-center gap-2 text-charcoal-600 hover:text-brand-700">
                  <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
