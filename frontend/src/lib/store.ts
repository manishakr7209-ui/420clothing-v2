'use client'
import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  size: string
  colour: string
  quantity: number
  slug: string
  cat: string
}

export interface WishItem {
  id: string
  name: string
  price: number
  slug: string
  cat: string
}

interface Store {
  cart: CartItem[]
  wishlist: WishItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string, colour: string) => void
  updateQty: (id: string, size: string, colour: string, qty: number) => void
  clearCart: () => void
  toggleWish: (item: WishItem) => void
  isWished: (id: string) => boolean
  total: () => number
  count: () => number
}

export const useStore = create<Store>((set, get) => ({
  cart: [],
  wishlist: [],

  addToCart: (item) => {
    const exists = get().cart.find(
      (c) => c.id === item.id && c.size === item.size && c.colour === item.colour
    )
    if (exists) {
      set((s) => ({
        cart: s.cart.map((c) =>
          c.id === item.id && c.size === item.size && c.colour === item.colour
            ? { ...c, quantity: c.quantity + 1 }
            : c
        ),
      }))
    } else {
      set((s) => ({ cart: [...s.cart, { ...item, quantity: 1 }] }))
    }
  },

  removeFromCart: (id, size, colour) =>
    set((s) => ({
      cart: s.cart.filter(
        (c) => !(c.id === id && c.size === size && c.colour === colour)
      ),
    })),

  updateQty: (id, size, colour, qty) => {
    if (qty <= 0) { get().removeFromCart(id, size, colour); return }
    set((s) => ({
      cart: s.cart.map((c) =>
        c.id === id && c.size === size && c.colour === colour
          ? { ...c, quantity: qty }
          : c
      ),
    }))
  },

  clearCart: () => set({ cart: [] }),

  toggleWish: (item) => {
    const exists = get().wishlist.find((w) => w.id === item.id)
    if (exists) {
      set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== item.id) }))
    } else {
      set((s) => ({ wishlist: [...s.wishlist, item] }))
    }
  },

  isWished: (id) => get().wishlist.some((w) => w.id === id),
  total: () => get().cart.reduce((sum, c) => sum + c.price * c.quantity, 0),
  count: () => get().cart.reduce((sum, c) => sum + c.quantity, 0),
}))
