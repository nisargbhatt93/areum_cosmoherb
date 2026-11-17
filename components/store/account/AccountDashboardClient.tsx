'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { User, Package, MapPin, Heart, LogOut, Truck, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'

interface OrderItemData {
  id: string
  productName: string
  quantity: number
  price: number
  total: number
  productId: string
  product?: {
    slug: string
    sku: string
    stock: number
    mrp: number
    images: Array<{ url: string }>
  }
}

interface OrderData {
  id: string
  orderNumber: string
  createdAt: string | Date
  total: number
  status: string
  paymentMethod: string
  expectedDelivery?: string | Date | null
  items: OrderItemData[]
}

interface AddressData {
  id: string
  name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface AccountDashboardClientProps {
  user: {
    id: string
    name: string | null
    email: string
    phone?: string | null
  }
  orders: OrderData[]
  addresses: AddressData[]
}

export default function AccountDashboardClient({ user, orders, addresses }: AccountDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders')
  const addItem = useCartStore((s) => s.addItem)
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlistStore()

  // Buy Again / Reorder handler
  const handleBuyAgain = (item: OrderItemData) => {
    if (!item.product) return
    if (item.product.stock <= 0) {
      toast.error('Sorry, this product is currently out of stock.')
      return
    }

    addItem({
      productId: item.productId,
      name: item.productName,
      slug: item.product.slug,
      image: item.product.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800',
      price: item.price,
      mrp: item.product.mrp,
      quantity: 1,
      stock: item.product.stock,
      sku: item.product.sku,
    })
    toast.success(`Added ${item.productName} to your cart!`)
  }

  return (
    <div className="bg-cream-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-100 text-brand-800 rounded-full flex items-center justify-center font-bold text-xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                Hello, {user.name || 'Valued Customer'}
              </h1>
              <p className="text-xs text-charcoal-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-secondary text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-charcoal-100 shadow-2xs space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'orders' ? 'bg-brand-50 text-brand-800' : 'text-charcoal-700 hover:bg-cream-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" /> My Orders ({orders.length})
              </span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'addresses' ? 'bg-brand-50 text-brand-800' : 'text-charcoal-700 hover:bg-cream-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
              </span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'wishlist' ? 'bg-brand-50 text-brand-800' : 'text-charcoal-700 hover:bg-cream-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" /> Wishlist ({wishlistItems.length})
              </span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'profile' ? 'bg-brand-50 text-brand-800' : 'text-charcoal-700 hover:bg-cream-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4" /> Profile & Settings
              </span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-9">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                  Order History & Live Status
                </h2>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 shadow-2xs">
                    <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                    <h3 className="font-bold text-charcoal-900 mb-1">No Orders Yet</h3>
                    <p className="text-xs text-charcoal-500 mb-6">Discover our herbal care products and place your first order.</p>
                    <Link href="/shop" className="btn-primary text-xs py-2.5 px-6">
                      Explore Shop
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs space-y-4"
                      >
                        {/* Order card header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-100 pb-4 text-xs">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div>
                              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Order #</span>
                              <span className="font-mono font-bold text-charcoal-900">{order.orderNumber}</span>
                            </div>
                            <div>
                              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Placed On</span>
                              <span className="font-semibold text-charcoal-800">{formatDate(order.createdAt)}</span>
                            </div>
                            <div>
                              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Total Amount</span>
                              <span className="font-extrabold text-brand-800">{formatPrice(order.total)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="bg-brand-50 text-brand-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                              {order.status}
                            </span>
                            <Link
                              href={`/track-order?orderNumber=${order.orderNumber}`}
                              className="btn-secondary text-[11px] py-1 px-3 flex items-center gap-1 bg-white"
                            >
                              <Truck className="w-3 h-3" /> Track
                            </Link>
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="divide-y divide-charcoal-100">
                          {order.items.map((item) => {
                            const img = item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'
                            return (
                              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                                    <Image src={img} alt={item.productName} fill className="object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 line-clamp-1">{item.productName}</h4>
                                    <p className="text-[11px] text-charcoal-500">Qty: {item.quantity} • {formatPrice(item.price)}</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleBuyAgain(item)}
                                  className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 border border-brand-200 px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap"
                                >
                                  <RefreshCw className="w-3 h-3" /> Buy Again
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                    Saved Delivery Addresses
                  </h2>
                </div>

                {addresses.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-charcoal-100 text-xs text-charcoal-500">
                    No saved addresses yet. Addresses are saved during checkout.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-2xs space-y-2 text-xs relative"
                      >
                        {addr.isDefault && (
                          <span className="inline-block bg-brand-50 text-brand-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                            Default Address
                          </span>
                        )}
                        <h3 className="font-bold text-sm text-charcoal-900">{addr.name}</h3>
                        <p className="text-charcoal-600 font-medium">{addr.phone}</p>
                        <p className="text-charcoal-600 leading-relaxed">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                  Your Saved Herbal Wishlist ({wishlistItems.length})
                </h2>

                {wishlistItems.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 shadow-2xs">
                    <Heart className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                    <h3 className="font-bold text-charcoal-900 mb-1">Your Wishlist is Empty</h3>
                    <p className="text-xs text-charcoal-500 mb-6">Heart any item in the catalog to save it for later.</p>
                    <Link href="/shop" className="btn-primary text-xs py-2.5 px-6">
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.productId} className="bg-white rounded-2xl p-4 border border-charcoal-100 shadow-2xs space-y-3">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <h4 className="font-bold text-xs text-charcoal-900 line-clamp-1">{item.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-brand-800">{formatPrice(item.price)}</span>
                          <button
                            onClick={() => {
                              addItem({
                                productId: item.productId,
                                name: item.name,
                                slug: item.slug,
                                image: item.image,
                                price: item.price,
                                mrp: item.mrp,
                                quantity: 1,
                                stock: item.stock,
                                sku: `SKU-${item.productId.slice(0, 5)}`,
                              })
                              removeWishlistItem(item.productId)
                              toast.success('Moved to cart!')
                            }}
                            className="btn-primary text-[11px] py-1.5 px-3"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-2xs space-y-6">
                <h2 className="text-xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
                  Personal Profile
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-charcoal-400 block mb-1">Full Name</label>
                    <div className="p-3 bg-cream-50 rounded-xl font-bold text-charcoal-800 border border-charcoal-100">
                      {user.name || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-charcoal-400 block mb-1">Registered Email</label>
                    <div className="p-3 bg-cream-50 rounded-xl font-bold text-charcoal-800 border border-charcoal-100">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-charcoal-400 block mb-1">Mobile Number</label>
                    <div className="p-3 bg-cream-50 rounded-xl font-bold text-charcoal-800 border border-charcoal-100">
                      {user.phone || '9876543210'}
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-charcoal-400 block mb-1">Account Role</label>
                    <div className="p-3 bg-cream-50 rounded-xl font-bold text-brand-800 border border-charcoal-100 capitalize">
                      Verified Customer
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
