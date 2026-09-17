'use client'
import { useState } from 'react'

const COLOURS = [
  { name: 'Black',  hex: '#111111', border: '#444' },
  { name: 'White',  hex: '#f0f0f0', border: '#888' },
  { name: 'Olive',  hex: '#4b5320', border: '#4b5320' },
  { name: 'Grey',   hex: '#6b7280', border: '#6b7280' },
  { name: 'Navy',   hex: '#1e3a5f', border: '#1e3a5f' },
  { name: 'Maroon', hex: '#7c1c1c', border: '#7c1c1c' },
]
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

interface Props {
  onFilter: (filters: any) => void
}

export default function Sidebar({ onFilter }: Props) {
  const [price, setPrice]       = useState(1999)
  const [activeCat, setActiveCat] = useState('all')
  const [selSizes, setSelSizes] = useState<string[]>(['S','M','L','XL'])
  const [selColors, setSelColors] = useState<string[]>(['Black'])

  const cats = [
    { id: 'all',     label: 'All Products',    icon: 'ti-layout-grid' },
    { id: 'tshirt',  label: 'T-Shirts',        icon: 'ti-shirt' },
    { id: 'jogger',  label: 'Joggers & Lowers', icon: 'ti-shirt' },
    { id: 'gym',     label: 'Gym Wear',         icon: 'ti-shirt' },
  ]

  const toggleSize = (s: string) =>
    setSelSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const toggleColor = (c: string) =>
    setSelColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])

  const clearFilters = () => {
    setPrice(1999); setActiveCat('all')
    setSelSizes(['S','M','L','XL']); setSelColors(['Black'])
    onFilter({})
  }

  return (
    <aside className="w-48 bg-[#0c0c0c] border-r border-brand-border px-4 py-5 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto hidden md:block">

      {/* Category */}
      <div className="mb-5">
        <p className="text-[10px] tracking-[3px] text-brand-green uppercase mb-2 flex items-center gap-1">
          <i className="ti ti-layout-grid" /> Category
        </p>
        {cats.map((c) => (
          <div
            key={c.id}
            onClick={() => { setActiveCat(c.id); onFilter({ category: c.id }) }}
            className={`flex items-center gap-2 py-1.5 cursor-pointer text-xs tracking-[1px] transition-colors ${activeCat === c.id ? 'text-brand-green' : 'text-brand-muted hover:text-brand-text'}`}
          >
            <i className={`ti ${c.icon} text-sm`} /> {c.label}
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-5">
        <p className="text-[10px] tracking-[3px] text-brand-green uppercase mb-2 flex items-center gap-1">
          <i className="ti ti-currency-rupee" /> Price
        </p>
        <input
          type="range" min={199} max={1999} value={price} step={1}
          onChange={(e) => { setPrice(Number(e.target.value)); onFilter({ maxPrice: e.target.value }) }}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-brand-muted mt-1">
          <span>₹199</span><span>Up to ₹{price}</span>
        </div>
      </div>

      {/* Colour */}
      <div className="mb-5">
        <p className="text-[10px] tracking-[3px] text-brand-green uppercase mb-2 flex items-center gap-1">
          <i className="ti ti-palette" /> Colour
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {COLOURS.map((c) => (
            <div
              key={c.name}
              title={c.name}
              onClick={() => toggleColor(c.name)}
              className="w-5 h-5 rounded-full cursor-pointer transition-transform hover:scale-110"
              style={{
                background: c.hex,
                border: `2px solid ${selColors.includes(c.name) ? '#c8f500' : c.border}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-5">
        <p className="text-[10px] tracking-[3px] text-brand-green uppercase mb-2 flex items-center gap-1">
          <i className="ti ti-ruler" /> Size
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {SIZES.map((s) => (
            <span
              key={s}
              onClick={() => toggleSize(s)}
              className={`text-[10px] px-2 py-1 rounded cursor-pointer tracking-[1px] border transition-all ${
                selSizes.includes(s)
                  ? 'border-brand-green text-brand-green bg-brand-green/10'
                  : 'border-brand-border text-brand-muted hover:border-brand-muted'
              }`}
            >{s}</span>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full text-[10px] tracking-[2px] text-brand-green border border-brand-green/30 py-1.5 rounded-full hover:bg-brand-green/10 transition-colors"
      >
        CLEAR FILTERS
      </button>
    </aside>
  )
}
