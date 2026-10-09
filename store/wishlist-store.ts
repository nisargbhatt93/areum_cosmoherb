import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItemType {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  mrp: number
  stock: number
}

interface WishlistState {
  items: WishlistItemType[]
  addItem: (item: WishlistItemType) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItemType) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => ({
          items: state.items.some((i) => i.productId === item.productId)
            ? state.items
            : [...state.items, item],
        }))
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      toggleItem: (item) => {
        const { isInWishlist, addItem, removeItem } = get()
        if (isInWishlist(item.productId)) {
          removeItem(item.productId)
        } else {
          addItem(item)
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'areum-wishlist',
    }
  )
)
