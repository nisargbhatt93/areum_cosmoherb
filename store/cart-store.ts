import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItemType {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  price: number
  mrp: number
  quantity: number
  stock: number
  sku: string
}

interface CartState {
  items: CartItemType[]
  couponCode: string
  couponDiscount: number
  couponId: string | null
  addItem: (item: Omit<CartItemType, 'id'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number, couponId: string) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponDiscount: 0,
      couponId: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { ...item, id: `cart-${item.productId}-${Date.now()}` },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0, couponId: null }),

      applyCoupon: (code, discount, couponId) =>
        set({ couponCode: code, couponDiscount: discount, couponId }),

      removeCoupon: () => set({ couponCode: '', couponDiscount: 0, couponId: null }),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'areum-cart',
    }
  )
)
