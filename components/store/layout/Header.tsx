'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true)
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 200)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
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
            {/* Official Brand Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-gold-400/60 shadow-xs flex-shrink-0 bg-brand-900 ring-2 ring-brand-100/50">
                <Image
                  src="/logo.jpg"
                  alt="Areum Cosmoherb Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="leading-tight">
                <span
                  className="block text-brand-900 font-bold text-lg md:text-xl tracking-wider leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  AREUM
                </span>
                <span className="block text-brand-700 text-[8px] md:text-[9.5px] tracking-wider uppercase font-semibold leading-none mt-1">
                  Where Nature Creates Beauty
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav ref={navRef} className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative group py-2"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className={`flex items-center gap-1 px-3 py-2 font-medium text-sm transition-colors rounded-lg ${
                        openDropdown === link.label
                          ? 'text-brand-800 bg-brand-50'
                          : 'text-charcoal-700 hover:text-brand-700 hover:bg-brand-50'
                      }`}
                      aria-expanded={openDropdown === link.label}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === link.label ? 'rotate-180 text-brand-700' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div
                        className="absolute top-full left-0 pt-1 z-50 w-56"
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-charcoal-100 py-2.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 border-b border-charcoal-50 mb-1">
                            Browse Categories
                          </div>
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-charcoal-700 hover:text-brand-800 hover:bg-brand-50/80 transition-colors group/item"
                            >
                              <span>{child.label}</span>
                              <span className="text-brand-400 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs">
                                →
                              </span>
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
                  {link.children ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 text-charcoal-800 font-medium rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-charcoal-400 transition-transform duration-200 ${
                            mobileCategoriesOpen ? 'rotate-180 text-brand-600' : ''
                          }`}
                        />
                      </button>
                      {mobileCategoriesOpen && (
                        <div className="pl-4 pr-2 py-1 space-y-1 bg-brand-50/40 rounded-xl my-1 border border-brand-100/50">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-3 py-2 text-sm text-charcoal-700 hover:text-brand-800 hover:bg-white rounded-lg transition-colors font-medium"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-charcoal-700 font-medium rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      {link.label}
                    </Link>
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
