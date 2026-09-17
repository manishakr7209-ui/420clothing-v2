import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  colour: string
  quantity: number
  slug: string
}

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface CartStore {
  items: CartItem[]
  wishlist: WishlistItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string, colour: string) => void
  updateQuantity: (id: string, size: string, colour: string, qty: number) => void
  clearCart: () => void
  toggleWishlist: (item: WishlistItem) => void
  isWishlisted: (id: string) => boolean
  cartTotal: () => number
  cartCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      addToCart: (item) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.size === item.size && i.colour === item.colour
        )
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id && i.size === item.size && i.colour === item.colour
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set((state) => ({ items: [...state.items, { ...item, quantity: 1 }] }))
        }
      },

      removeFromCart: (id, size, colour) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.colour === colour)
          ),
        }))
      },

      updateQuantity: (id, size, colour, qty) => {
        if (qty <= 0) {
          get().removeFromCart(id, size, colour)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size && i.colour === colour
              ? { ...i, quantity: qty }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleWishlist: (item) => {
        const exists = get().wishlist.find((i) => i.id === item.id)
        if (exists) {
          set((state) => ({ wishlist: state.wishlist.filter((i) => i.id !== item.id) }))
        } else {
          set((state) => ({ wishlist: [...state.wishlist, item] }))
        }
      },

      isWishlisted: (id) => get().wishlist.some((i) => i.id === id),

      cartTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      cartCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: '420clothing-cart' }
  )
)
