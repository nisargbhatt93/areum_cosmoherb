'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Boxes,
  Leaf,
} from 'lucide-react'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Don't render admin navigation on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    toast.info('Signed out of admin dashboard.')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-charcoal-50 flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-brand-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-400/60 bg-brand-900 flex-shrink-0">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-bold text-sm tracking-wide">Areum Operations</span>
        </div>
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="p-1 rounded-lg text-brand-200 hover:text-white"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-brand-900 text-white flex flex-col transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand logo header */}
        <div className="p-6 border-b border-brand-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400/60 shadow-inner flex-shrink-0 bg-brand-900">
              <Image src="/logo.jpg" alt="Areum Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="block font-bold text-base leading-tight tracking-wider">AREUM</span>
              <span className="block text-[9px] tracking-wider uppercase text-brand-300 font-semibold">Operations Center</span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-brand-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-brand-200 hover:bg-brand-800/60 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold text-brand-300 hover:bg-brand-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Live Store
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
