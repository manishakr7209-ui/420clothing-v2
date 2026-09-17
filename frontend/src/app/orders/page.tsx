'use client'

const SAMPLE_ORDERS = [
  { id: '420-847291', date: '22 Aug 2026', status: 'Delivered',  statusColor: '#44cc88', payment: 'UPI',  total: 1648, items: [{ name: 'Acid Wash Graphic Tee', size: 'L', colour: 'Black', qty: 1, price: 699 }, { name: 'Cargo Lower Pants', size: 'M', colour: 'Black', qty: 1, price: 899 }] },
  { id: '420-634019', date: '18 Aug 2026', status: 'Shipped',    statusColor: '#64b4ff', payment: 'COD',  total: 999,  items: [{ name: 'Slim Fit Black Jogger', size: 'M', colour: 'Black', qty: 1, price: 999 }] },
  { id: '420-291847', date: '10 Aug 2026', status: 'Processing', statusColor: '#ff9900', payment: 'QR',   total: 549,  items: [{ name: 'Compression Gym Vest', size: 'XL', colour: 'Navy', qty: 1, price: 549 }] },
]

export default function OrdersPage() {
  const S: Record<string, React.CSSProperties> = {
    page:  { background: '#080808', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'Barlow, sans-serif' },
    nav:   { background: '#0e0e0e', borderBottom: '1px solid #1c1c1c', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo:  { fontSize: '22px', letterSpacing: '5px', color: '#c8f500', cursor: 'pointer' },
    wrap:  { maxWidth: '800px', margin: '0 auto', padding: '30px 20px' },
    card:  { background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  }

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => window.location.href = '/'}>
          420 <span style={{ fontSize: '10px', color: '#555' }}>CLOTHING</span>
        </div>
        <button onClick={() => window.location.href = '/'} style={{ background: 'none', border: '1px solid #2a2a2a', color: '#555', padding: '5px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px' }}>
          ← BACK TO STORE
        </button>
      </nav>

      <div style={S.wrap}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', letterSpacing: '4px', color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>MY ORDERS</h1>
          <p style={{ fontSize: '11px', color: '#444', letterSpacing: '2px' }}>YOUR ORDER HISTORY · 420 CLOTHING</p>
        </div>

        {SAMPLE_ORDERS.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '14px', letterSpacing: '3px', color: '#333', marginBottom: '16px' }}>NO ORDERS YET</p>
            <button onClick={() => window.location.href = '/'} style={{ background: '#c8f500', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', letterSpacing: '3px', cursor: 'pointer', fontWeight: 'bold' }}>
              SHOP NOW
            </button>
          </div>
        ) : (
          SAMPLE_ORDERS.map(order => (
            <div key={order.id} style={S.card}>
              {/* Order header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', letterSpacing: '3px', color: '#c8f500', fontWeight: 'bold', marginBottom: '2px' }}>{order.id}</p>
                  <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>{order.date}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '1px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(100,180,255,0.1)', color: '#64b4ff', border: '1px solid rgba(100,180,255,0.25)', fontWeight: 'bold' }}>
                    {order.payment}
                  </span>
                  <span style={{ fontSize: '9px', letterSpacing: '1px', padding: '3px 10px', borderRadius: '20px', background: `${order.statusColor}15`, color: order.statusColor, border: `1px solid ${order.statusColor}40`, fontWeight: 'bold' }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#161616', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>👕</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#ccc', marginBottom: '2px' }}>{item.name}</p>
                      <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>{item.size} · {item.colour} · Qty: {item.qty}</p>
                    </div>
                    <span style={{ fontSize: '14px', color: '#c8f500', fontWeight: 'bold' }}>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {order.status === 'Delivered' && (
                    <button style={{ fontSize: '10px', letterSpacing: '1px', padding: '5px 12px', border: '1px solid rgba(200,245,0,0.3)', color: '#c8f500', background: 'rgba(200,245,0,0.08)', borderRadius: '5px', cursor: 'pointer' }}>
                      REORDER
                    </button>
                  )}
                  <button style={{ fontSize: '10px', letterSpacing: '1px', padding: '5px 12px', border: '1px solid #2a2a2a', color: '#555', background: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    VIEW DETAILS
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '9px', color: '#444', letterSpacing: '1px', marginBottom: '2px' }}>ORDER TOTAL</p>
                  <p style={{ fontSize: '20px', color: '#c8f500', fontWeight: 'bold', letterSpacing: '1px' }}>₹{order.total}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
