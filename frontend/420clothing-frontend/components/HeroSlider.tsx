'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    label:    'Summer Drop 2025',
    title:    'WEAR THE',
    accent:   'STREETS',
    sub:      'PRINTED TEES · JOGGERS · GYM WEAR',
    btn:      'SHOP NOW',
    href:     '/shop',
    mark:     '420',
    markSub:  'CLOTHING',
  },
  {
    label:    'New Arrivals',
    title:    'GYM',
    accent:   'EDITION',
    sub:      'COMPRESSION · DRY FIT · PERFORMANCE',
    btn:      'SHOP GYM WEAR',
    href:     '/shop?category=gym',
    mark:     'GYM',
    markSub:  'SERIES',
  },
  {
    label:    'Monsoon Collection',
    title:    'STAY',
    accent:   'FRESH',
    sub:      'JOGGERS · LOWERS · COMFORT FITS',
    btn:      'SHOP JOGGERS',
    href:     '/shop?category=jogger',
    mark:     'DROP',
    markSub:  '2025',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[current]

  return (
    <div className="relative bg-brand-surface border border-brand-border rounded-xl px-7 py-8 mb-5 flex items-center justify-between overflow-hidden min-h-[200px]">
      {/* BG accent */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-[#151515]" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }} />

      {/* Content */}
      <div className="relative z-10 animate-fade-in" key={current}>
        <p className="text-[10px] tracking-[4px] text-brand-green uppercase mb-2">{slide.label}</p>
        <h1 className="font-bebas text-5xl md:text-6xl tracking-[4px] text-white leading-none mb-2">
          {slide.title}<br />
          <span className="text-brand-green">{slide.accent}</span>
        </h1>
        <p className="text-[11px] text-brand-muted tracking-[3px] mb-5">{slide.sub}</p>
        <Link
          href={slide.href}
          className="inline-block bg-brand-green text-black font-bebas text-base tracking-[3px] px-6 py-2.5 rounded-md hover:bg-[#d4ff10] transition-colors"
        >
          {slide.btn}
        </Link>
        <div className="flex gap-2 mt-4">
          <span className="text-[10px] tracking-[2px] text-brand-muted border border-brand-border px-2 py-1 rounded-full">FREE SHIPPING ₹799+</span>
          <span className="text-[10px] tracking-[2px] text-brand-muted border border-brand-border px-2 py-1 rounded-full">COD AVAILABLE</span>
        </div>
      </div>

      {/* Brand mark */}
      <div className="relative z-10 text-right hidden md:block">
        <div className="font-bebas text-8xl text-[#1a1a1a] tracking-[6px] leading-none">{slide.mark}</div>
        <div className="text-[10px] tracking-[5px] text-[#2a2a2a]">{slide.markSub}</div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 border border-brand-border rounded-full flex items-center justify-center text-brand-muted hover:border-brand-green hover:text-brand-green transition-all"
      >
        <i className="ti ti-chevron-left text-sm" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 border border-brand-border rounded-full flex items-center justify-center text-brand-muted hover:border-brand-green hover:text-brand-green transition-all"
      >
        <i className="ti ti-chevron-right text-sm" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-brand-green' : 'bg-brand-border'}`}
          />
        ))}
      </div>
    </div>
  )
}
