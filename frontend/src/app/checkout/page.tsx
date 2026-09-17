'use client'
import { useState } from 'react'
import { useStore } from '../../lib/store'

type PayMethod = 'UPI' | 'QR' | 'COD'
type Step = 'details' | 'payment' | 'success'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useStore()
  const [step, setStep]       = useState<Step>('details')
  const [payMethod, setPayMethod] = useState<PayMethod | ''>('')
  const [orderNum] = useState('420-' + Math.floor(100000 + Math.random() * 900000))
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', pincode: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim())    e.city    = 'City is required'
    if (!form.pincode.trim() || form.pincode.length < 6) e.pincode = 'Valid pincode required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep('payment')
  }

  const handleOrder = () => {
    if (!payMethod) { alert('Please select payment method'); return }
    clearCart()
    setStep('success')
  }

  const S: Record<string, React.CSSProperties> = {
    page:    { background: '#080808', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'Barlow, sans-serif' },
    nav:     { background: '#0e0e0e', borderBottom: '1px solid #1c1c1c', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo:    { fontSize: '22px', letterSpacing: '5px', color: '#c8f500', cursor: 'pointer' },
    wrap:    { maxWidth: '900px', margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' },
    card:    { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px' },
    title:   { fontSize: '14px', letterSpacing: '3px', color: '#c8f500', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
    input:   { width: '100%', background: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#ccc', outline: 'none', fontFamily: 'Barlow, sans-serif' },
    inputErr:{ width: '100%', background: '#0e0e0e', border: '1px solid #ff4444', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#ccc', outline: 'none', fontFamily: 'Barlow, sans-serif' },
    label:   { fontSize: '9px', letterSpacing: '2px', color: '#444', marginBottom: '5px', display: 'block', textTransform: 'uppercase' as const },
    err:     { fontSize: '10px', color: '#ff4444', marginTop: '3px', letterSpacing: '1px' },
    btn:     { width: '100%', background: '#c8f500', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', letterSpacing: '3px', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px' },
    stepRow: { display: 'flex', gap: '0', marginBottom: '24px', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' },
  }

  const stepStyle = (s: Step): React.CSSProperties => ({
    flex: 1, padding: '10px', textAlign: 'center', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold',
    background: step === s ? 'rgba(200,245,0,0.1)' : '#0e0e0e',
    color: step === s ? '#c8f500' : '#333',
    borderRight: '1px solid #1e1e1e',
  })

  if (cart.length === 0 && step !== 'success') {
    return (
      <div style={S.page}>
        <nav style={S.nav}>
          <div style={S.logo} onClick={() => window.location.href = '/'}>420 <span style={{ fontSize: '10px', color: '#555' }}>CLOTHING</span></div>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
          <div style={{ fontSize: '48px' }}>🛍</div>
          <p style={{ fontSize: '14px', letterSpacing: '3px', color: '#333' }}>YOUR CART IS EMPTY</p>
          <button onClick={() => window.location.href = '/'} style={{ ...S.btn, width: 'auto', padding: '10px 24px' }}>SHOP NOW</button>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>

      {/* NAVBAR */}
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => window.location.href = '/'}>420 <span style={{ fontSize: '10px', color: '#555' }}>CLOTHING</span></div>
        <div style={{ fontSize: '11px', color: '#444', letterSpacing: '2px' }}>SECURE CHECKOUT 🔒</div>
      </nav>

      {step === 'success' ? (
        /* SUCCESS PAGE */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px', textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '64px' }}>🎉</div>
          <div style={{ fontSize: '32px', letterSpacing: '4px', color: '#c8f500', fontWeight: 'bold' }}>ORDER PLACED!</div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '20px 32px', margin: '8px 0' }}>
            <p style={{ fontSize: '10px', letterSpacing: '3px', color: '#444', marginBottom: '6px' }}>ORDER NUMBER</p>
            <p style={{ fontSize: '24px', letterSpacing: '4px', color: '#c8f500', fontWeight: 'bold' }}>{orderNum}</p>
          </div>
          <p style={{ fontSize: '13px', color: '#666', maxWidth: '360px', lineHeight: 1.7 }}>
            Thank you <strong style={{ color: '#ccc' }}>{form.name}</strong>! Your order will be delivered to <strong style={{ color: '#ccc' }}>{form.city}</strong>.
          </p>
          {payMethod === 'UPI' && (
            <div style={{ background: '#111', border: '1px solid rgba(100,180,255,0.3)', borderRadius: '8px', padding: '14px 20px', fontSize: '12px', color: '#64b4ff', textAlign: 'center', lineHeight: 1.7 }}>
              💳 Send ₹{total()} to UPI ID: <strong>yourname@upi</strong><br />
              Add order number <strong>{orderNum}</strong> in payment note
            </div>
          )}
          {payMethod === 'QR' && (
            <div style={{ background: '#111', border: '1px solid rgba(255,120,60,0.3)', borderRadius: '8px', padding: '14px 20px', fontSize: '12px', color: '#ff783c', textAlign: 'center', lineHeight: 1.7 }}>
              📱 Scan QR code to pay ₹{total()}<br />
              Add order number <strong>{orderNum}</strong> in payment note
            </div>
          )}
          {payMethod === 'COD' && (
            <div style={{ background: '#111', border: '1px solid rgba(200,245,0,0.3)', borderRadius: '8px', padding: '14px 20px', fontSize: '12px', color: '#c8f500', textAlign: 'center', lineHeight: 1.7 }}>
              🚚 Pay ₹{total()} cash on delivery<br />
              Expected delivery: 3–5 business days
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => window.location.href = '/'} style={{ ...S.btn, width: 'auto', padding: '10px 24px' }}>CONTINUE SHOPPING</button>
            <button onClick={() => window.location.href = '/orders'} style={{ ...S.btn, width: 'auto', padding: '10px 24px', background: 'transparent', color: '#c8f500', border: '1px solid rgba(200,245,0,0.3)' }}>MY ORDERS</button>
          </div>
        </div>
      ) : (
        <div style={S.wrap}>

          {/* LEFT — FORM */}
          <div>
            {/* Steps */}
            <div style={S.stepRow}>
              <div style={stepStyle('details')}>1. DELIVERY</div>
              <div style={stepStyle('payment')}>2. PAYMENT</div>
              <div style={{ ...stepStyle('success'), borderRight: 'none' }}>3. CONFIRM</div>
            </div>

            {step === 'details' && (
              <div style={S.card}>
                <div style={S.title}>📦 Delivery Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={S.label}>Full Name *</label>
                    <input style={errors.name ? S.inputErr : S.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rohan Mehta" />
                    {errors.name && <p style={S.err}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={S.label}>Phone Number *</label>
                    <input style={errors.phone ? S.inputErr : S.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" type="tel" maxLength={10} />
                    {errors.phone && <p style={S.err}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label style={S.label}>Email (optional)</label>
                    <input style={S.input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rohan@email.com" type="email" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={S.label}>Full Address *</label>
                    <textarea style={{ ...S.input, minHeight: '70px', resize: 'vertical' } as React.CSSProperties} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House no, Street, Area, Landmark" />
                    {errors.address && <p style={S.err}>{errors.address}</p>}
                  </div>
                  <div>
                    <label style={S.label}>City *</label>
                    <input style={errors.city ? S.inputErr : S.input} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" />
                    {errors.city && <p style={S.err}>{errors.city}</p>}
                  </div>
                  <div>
                    <label style={S.label}>Pincode *</label>
                    <input style={errors.pincode ? S.inputErr : S.input} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="400001" maxLength={6} />
                    {errors.pincode && <p style={S.err}>{errors.pincode}</p>}
                  </div>
                </div>
                <button style={S.btn} onClick={handleNext}>CONTINUE TO PAYMENT →</button>
              </div>
            )}

            {step === 'payment' && (
              <div style={S.card}>
                <div style={S.title}>💳 Select Payment Method</div>

                {/* UPI */}
                <div onClick={() => setPayMethod('UPI')} style={{ border: `1px solid ${payMethod === 'UPI' ? '#64b4ff' : '#1e1e1e'}`, background: payMethod === 'UPI' ? 'rgba(100,180,255,0.07)' : '#0e0e0e', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${payMethod === 'UPI' ? '#64b4ff' : '#333'}`, background: payMethod === 'UPI' ? '#64b4ff' : 'transparent' }} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', marginBottom: '2px' }}>UPI Payment</p>
                      <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>PhonePe · GPay · Paytm · Any UPI App</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '20px' }}>📱</span>
                  </div>
                  {payMethod === 'UPI' && (
                    <div style={{ marginTop: '12px', padding: '10px', background: '#111', borderRadius: '6px', fontSize: '12px', color: '#64b4ff', textAlign: 'center', lineHeight: 1.7 }}>
                      Send ₹{total()} to: <strong>yourname@upi</strong><br />
                      <span style={{ color: '#444', fontSize: '10px' }}>Add your order number as note after placing</span>
                    </div>
                  )}
                </div>

                {/* QR */}
                <div onClick={() => setPayMethod('QR')} style={{ border: `1px solid ${payMethod === 'QR' ? '#ff783c' : '#1e1e1e'}`, background: payMethod === 'QR' ? 'rgba(255,120,60,0.07)' : '#0e0e0e', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${payMethod === 'QR' ? '#ff783c' : '#333'}`, background: payMethod === 'QR' ? '#ff783c' : 'transparent' }} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', marginBottom: '2px' }}>QR Code Scanner</p>
                      <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>Scan & Pay instantly</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '20px' }}>🔲</span>
                  </div>
                  {payMethod === 'QR' && (
                    <div style={{ marginTop: '12px', padding: '14px', background: '#111', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ width: '100px', height: '100px', background: '#0e0e0e', border: '1px solid #2a2a2a', borderRadius: '6px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#333', letterSpacing: '1px' }}>
                        QR CODE<br />IMAGE<br />HERE
                      </div>
                      <p style={{ fontSize: '10px', color: '#444', marginTop: '8px' }}>Add your QR image in admin → payments</p>
                    </div>
                  )}
                </div>

                {/* COD */}
                <div onClick={() => setPayMethod('COD')} style={{ border: `1px solid ${payMethod === 'COD' ? '#c8f500' : '#1e1e1e'}`, background: payMethod === 'COD' ? 'rgba(200,245,0,0.07)' : '#0e0e0e', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${payMethod === 'COD' ? '#c8f500' : '#333'}`, background: payMethod === 'COD' ? '#c8f500' : 'transparent' }} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', marginBottom: '2px' }}>Cash on Delivery</p>
                      <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>Pay when your order arrives</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '20px' }}>💵</span>
                  </div>
                  {payMethod === 'COD' && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: '#111', borderRadius: '6px', fontSize: '11px', color: '#c8f500', textAlign: 'center' }}>
                      ✓ Pay ₹{total()} cash when your package arrives
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setStep('details')} style={{ ...S.btn, background: 'transparent', color: '#c8f500', border: '1px solid rgba(200,245,0,0.3)', flex: 1 }}>← BACK</button>
                  <button onClick={handleOrder} style={{ ...S.btn, flex: 2 }}>PLACE ORDER 🔥</button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div>
            <div style={S.card}>
              <div style={S.title}>🧾 Order Summary</div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #181818' }}>
                    <div style={{ width: '44px', height: '44px', background: '#161616', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👕</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '2px' }}>{item.name}</p>
                      <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>{item.size} · {item.colour} · Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '14px', color: '#c8f500', fontWeight: 'bold', flexShrink: 0 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555' }}>
                  <span>Subtotal</span><span>₹{total()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: total() >= 799 ? '#44cc88' : '#555' }}>
                  <span>Shipping</span>
                  <span>{total() >= 799 ? 'FREE 🎉' : '₹99'}</span>
                </div>
                {total() < 799 && (
                  <p style={{ fontSize: '10px', color: '#ff9900', letterSpacing: '1px' }}>
                    Add ₹{799 - total()} more for free shipping!
                  </p>
                )}
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#888', letterSpacing: '1px' }}>TOTAL</span>
                  <span style={{ fontSize: '24px', color: '#c8f500', fontWeight: 'bold' }}>₹{total() >= 799 ? total() : total() + 99}</span>
                </div>
              </div>

              {/* Delivery info */}
              {form.name && (
                <div style={{ marginTop: '14px', padding: '10px 12px', background: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '8px', fontSize: '11px', color: '#555', lineHeight: 1.8 }}>
                  📦 Delivering to:<br />
                  <span style={{ color: '#888' }}>{form.name}</span><br />
                  {form.address && <span style={{ color: '#666' }}>{form.address}, {form.city} — {form.pincode}</span>}
                </div>
              )}

              {/* Trust badges */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['🔒 Secure & Safe Checkout', '🚚 Fast Delivery 3–5 Days', '↩️ Easy Returns Policy'].map(b => (
                  <div key={b} style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>{b}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
