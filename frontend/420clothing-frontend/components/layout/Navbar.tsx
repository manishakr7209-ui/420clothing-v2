'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const cartCount = useCartStore((s) => s.cartCount())
  const wishlist = useCartStore((s) => s.wishlist)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-dark border-b border-brand-border h-14 flex items-center gap-3 px-4 md:px-6">
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-bebas text-2xl tracking-[5px] text-brand-green">
            420
          </span>
          <span className="font-barlow text-[11px] tracking-[3px] text-brand-muted ml-1 align-middle">
            CLOTHING
          </span>
        </Link>

        {/* SEARCH */}
        <div className="flex-1 flex items-center bg-[#161616] border border-brand-border rounded-md px-3 h-9 gap-2">
          <i className="ti ti-search text-brand-muted text-base" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search tees, joggers, gym wear..."
            className="bg-transparent border-none outline-none text-brand-text text-sm w-full font-barlow placeholder:text-brand-muted"
          />
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative w-9 h-9 bg-[#161616] border border-brand-border rounded-md flex items-center justify-center text-brand-muted hover:border-brand-green hover:text-brand-green transition-all">
            <i className="ti ti-heart text-base" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-9 h-9 bg-[#161616] border border-brand-border rounded-md flex items-center justify-center text-brand-muted hover:border-brand-green hover:text-brand-green transition-all"
          >
            <i className="ti ti-shopping-bag text-base" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login */}
          <Link
            href="/login"
            className="bg-brand-green text-black font-bebas text-sm tracking-[2px] px-4 py-1.5 rounded-md hover:bg-[#d4ff10] transition-colors"
          >
            LOGIN
          </Link>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
