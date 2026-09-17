'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  isNew?: boolean
  images: string[]
  category: { name: string; slug: string }
  inventory: { size: string; colour: string; quantity: number }[]
}

const BADGE: Record<string, string> = {
  tshirt: 'bg-brand-green/10 text-brand-green border-brand-green/30',
  jogger: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  gym:    'bg-accent-orange/10 text-accent-orange border-accent-orange/30',
}

const BADGE_LABEL: Record<string, string> = {
  tshirt: 'T-SHIRT',
  jogger: 'JOGGER',
  gym:    'GYM WEAR',
}

const COLOURS: Record<string, string> = {
  Black: '#111', White: '#f0f0f0', Olive: '#4b5320',
  Grey: '#6b7280', Navy: '#1e3a5f', Maroon: '#7c1c1c',
}

export default function ProductCard({ product }: { product: Product }) {
  const [selSize, setSelSize] = useState('')
  const { addToCart, toggleWishlist, isWishlisted } = useCartStore()

  const sizes = [...new Set(product.inventory.map((i) => i.size))]
  const colours = [...new Set(product.inventory.map((i) => i.colour))]
  const catSlug = product.category.slug
  const wished = isWishlisted(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const size = selSize || sizes[0] || 'M'
    const colour = colours[0] || 'Black'
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size,
      colour,
      quantity: 1,
      slug: product.slug,
    })
  }

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      slug: product.slug,
    })
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden hover:border-[#2e2e2e] hover:-translate-y-0.5 transition-all duration-200">

        {/* Image */}
        <div className="relative h-48 bg-[#161616] flex items-center justify-center overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <i className="ti ti-shirt text-5xl text-brand-border" />
          )}

          {/* Badges */}
          <span className={`absolute top-2 left-2 text-[9px] tracking-[1px] px-2 py-0.5 rounded-full font-semibold border ${BADGE[catSlug] || BADGE.tshirt}`}>
            {BADGE_LABEL[catSlug] || 'PRODUCT'}
          </span>
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-brand-green text-black text-[8px] tracking-[1px] px-1.5 py-0.5 rounded-full font-bold">
              NEW
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWish}
            className={`absolute bottom-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-all ${
              wished
                ? 'border-brand-green text-brand-green bg-brand-green/10'
                : 'border-brand-border bg-brand-dark text-brand-muted hover:border-brand-green hover:text-brand-green'
            }`}
          >
            <i className="ti ti-heart" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 pb-2">
          <p className="text-xs font-semibold text-brand-text mb-2 tracking-[0.5px] truncate">{product.name}</p>

          {/* Colour dots */}
          <div className="flex gap-1 mb-2">
            {colours.slice(0, 4).map((c) => (
              <div
                key={c}
                title={c}
                className="w-2.5 h-2.5 rounded-full border border-brand-border"
                style={{ background: COLOURS[c] || '#888' }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-bebas text-xl text-brand-green tracking-[1px]">₹{product.price}</span>
              {product.originalPrice && (
                <span className="font-barlow text-[11px] text-brand-muted line-through ml-1">₹{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="text-[9px] tracking-[1px] px-2.5 py-1.5 rounded border border-brand-green bg-brand-green/10 text-brand-green font-semibold hover:bg-brand-green hover:text-black transition-all"
            >
              + CART
            </button>
          </div>
        </div>

        {/* Sizes */}
        <div className="flex gap-1 px-3 pb-3 flex-wrap">
          {sizes.map((s) => (
            <span
              key={s}
              onClick={(e) => { e.preventDefault(); setSelSize(s) }}
              className={`text-[9px] px-1.5 py-0.5 rounded border tracking-[1px] cursor-pointer transition-all ${
                selSize === s
                  ? 'border-brand-green text-brand-green'
                  : 'border-brand-border text-brand-muted hover:border-brand-muted'
              }`}
            >{s}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
