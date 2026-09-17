'use client'
import { useCartStore } from '@/lib/store'
import Link from 'next/link'

interface Props { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCartStore()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-brand-surface border-l border-brand-border z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border bg-brand-dark">
          <span className="font-bebas text-xl tracking-[4px] text-brand-green">YOUR CART</span>
          <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors text-xl">
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <i className="ti ti-shopping-bag text-5xl text-brand-border" />
              <p className="text-brand-muted text-sm tracking-[2px]">CART IS EMPTY</p>
              <button onClick={onClose} className="text-brand-green text-sm border border-brand-green/30 px-4 py-2 rounded-md hover:bg-brand-green/10 transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-brand-border">
                  <div className="w-16 h-16 bg-[#161616] rounded-md flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <i className="ti ti-shirt text-2xl text-brand-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-text">{item.name}</p>
                    <p className="text-xs text-brand-muted tracking-[1px] mt-0.5">
                      {item.size} · {item.colour}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bebas text-lg text-brand-green tracking-[1px]">
                        ₹{item.price * item.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.colour, item.quantity - 1)}
                          className="w-6 h-6 bg-brand-dark border border-brand-border rounded text-brand-muted hover:text-white flex items-center justify-center text-sm"
                        >−</button>
                        <span className="text-sm text-brand-text w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.colour, item.quantity + 1)}
                          className="w-6 h-6 bg-brand-dark border border-brand-border rounded text-brand-muted hover:text-white flex items-center justify-center text-sm"
                        >+</button>
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.colour)}
                          className="w-6 h-6 text-red-500/50 hover:text-red-500 flex items-center justify-center text-sm ml-1"
                        >
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-brand-border bg-brand-dark">
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-muted text-sm tracking-[1px]">TOTAL</span>
              <span className="font-bebas text-2xl text-brand-green tracking-[1px]">₹{cartTotal()}</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-brand-muted tracking-[2px] mb-1">SELECT PAYMENT</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-[10px] tracking-[1px] font-semibold border border-accent-blue/30 bg-accent-blue/10 text-accent-blue rounded-md">UPI</button>
                <button className="flex-1 py-2 text-[10px] tracking-[1px] font-semibold border border-accent-orange/30 bg-accent-orange/10 text-accent-orange rounded-md">QR SCAN</button>
                <button className="flex-1 py-2 text-[10px] tracking-[1px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green rounded-md">COD</button>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-brand-green text-black font-bebas text-lg tracking-[3px] py-3 rounded-md text-center hover:bg-[#d4ff10] transition-colors mt-1"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
