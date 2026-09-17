'use client'
import { useState } from 'react'
import { useStore } from '../lib/store'

interface Props { open: boolean; onClose: () => void }

const PAYMENT_INFO: Record<string,string> = {
  UPI: 'Send payment to: yourname@upi\nUse PhonePe, GPay or Paytm',
  QR: 'Scan QR code to pay\n(Add your QR image in admin settings)',
  COD: 'Pay cash when your order arrives at your door.',
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQty, total, clearCart } = useStore()
  const [selPay, setSelPay] = useState('')
  const [ordered, setOrdered] = useState(false)

  const handleOrder = () => {
    if (!selPay) { alert('Please select a payment method'); return }
    setOrdered(true)
    clearCart()
    setTimeout(() => { setOrdered(false); onClose(); setSelPay('') }, 3000)
  }

  const PAY_STYLES: Record<string,React.CSSProperties> = {
    UPI: { border:`1px solid ${selPay==='UPI'?'#64b4ff':'rgba(100,180,255,0.25)'}`, background:`rgba(100,180,255,${selPay==='UPI'?'0.15':'0.08'})`, color:'#64b4ff' },
    QR:  { border:`1px solid ${selPay==='QR'?'#ff783c':'rgba(255,120,60,0.25)'}`,   background:`rgba(255,120,60,${selPay==='QR'?'0.15':'0.08'})`,   color:'#ff783c' },
    COD: { border:`1px solid ${selPay==='COD'?'#c8f500':'rgba(200,245,0,0.25)'}`,   background:`rgba(200,245,0,${selPay==='COD'?'0.12':'0.08'})`,   color:'#c8f500' },
  }

  return (
    <>
      {open && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:90}} onClick={onClose} />}
      <div style={{position:'fixed',top:0,right:0,height:'100%',width:'100%',maxWidth:'360px',background:'#111',borderLeft:'1px solid #222',zIndex:100,display:'flex',flexDirection:'column',transition:'transform 0.3s',transform:open?'translateX(0)':'translateX(100%)'}}>

        {/* Header */}
        <div style={{background:'#0e0e0e',padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #1c1c1c',flexShrink:0}}>
          <span style={{fontSize:'18px',letterSpacing:'4px',color:'#c8f500',fontWeight:'bold'}}>YOUR CART</span>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#555',fontSize:'20px',cursor:'pointer'}}>✕</button>
        </div>

        {/* Items */}
        <div style={{flex:1,overflowY:'auto',padding:'16px'}}>
          {ordered ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:'12px',textAlign:'center'}}>
              <div style={{fontSize:'48px'}}>🎉</div>
              <div style={{fontSize:'18px',letterSpacing:'3px',color:'#c8f500',fontWeight:'bold'}}>ORDER PLACED!</div>
              <p style={{fontSize:'12px',color:'#555',letterSpacing:'1px'}}>Thank you for shopping with 420 CLOTHING</p>
            </div>
          ) : cart.length === 0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:'10px'}}>
              <div style={{fontSize:'40px',color:'#1e1e1e'}}>🛍</div>
              <p style={{fontSize:'11px',color:'#333',letterSpacing:'2px'}}>CART IS EMPTY</p>
              <button onClick={onClose} style={{fontSize:'10px',color:'#c8f500',border:'1px solid rgba(200,245,0,0.3)',padding:'6px 14px',borderRadius:'5px',background:'none',cursor:'pointer',letterSpacing:'1px'}}>
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {cart.map((item,i) => (
                <div key={i} style={{display:'flex',gap:'10px',paddingBottom:'14px',borderBottom:'1px solid #181818'}}>
                  <div style={{width:'48px',height:'48px',background:'#161616',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>👕</div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'12px',fontWeight:600,color:'#ccc',marginBottom:'2px'}}>{item.name}</p>
                    <p style={{fontSize:'10px',color:'#444',letterSpacing:'1px',marginBottom:'6px'}}>{item.size} · {item.colour}</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:'16px',color:'#c8f500',fontWeight:'bold'}}>₹{item.price * item.quantity}</span>
                      <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                        <button onClick={()=>updateQty(item.id,item.size,item.colour,item.quantity-1)} style={{width:'22px',height:'22px',background:'#1a1a1a',border:'1px solid #2a2a2a',color:'#888',borderRadius:'4px',cursor:'pointer',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                        <span style={{fontSize:'12px',color:'#ccc',minWidth:'16px',textAlign:'center'}}>{item.quantity}</span>
                        <button onClick={()=>updateQty(item.id,item.size,item.colour,item.quantity+1)} style={{width:'22px',height:'22px',background:'#1a1a1a',border:'1px solid #2a2a2a',color:'#888',borderRadius:'4px',cursor:'pointer',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                        <button onClick={()=>removeFromCart(item.id,item.size,item.colour)} style={{width:'22px',height:'22px',background:'none',border:'none',color:'rgba(255,68,68,0.5)',cursor:'pointer',fontSize:'14px',marginLeft:'2px'}}>🗑</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!ordered && cart.length > 0 && (
          <div style={{padding:'16px',borderTop:'1px solid #1c1c1c',background:'#0e0e0e',flexShrink:0}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <span style={{fontSize:'12px',color:'#666',letterSpacing:'1px'}}>TOTAL</span>
              <span style={{fontSize:'24px',color:'#c8f500',fontWeight:'bold'}}>₹{total()}</span>
            </div>
            <p style={{fontSize:'9px',letterSpacing:'2px',color:'#444',marginBottom:'6px'}}>SELECT PAYMENT METHOD</p>
            <div style={{display:'flex',gap:'6px',marginBottom:'10px'}}>
              {(['UPI','QR','COD'] as const).map(m=>(
                <button key={m} onClick={()=>setSelPay(m)} style={{flex:1,padding:'7px',borderRadius:'5px',fontSize:'9px',letterSpacing:'1px',fontWeight:'bold',cursor:'pointer',...PAY_STYLES[m]}}>
                  {m==='QR'?'QR SCAN':m==='COD'?'COD':m}
                </button>
              ))}
            </div>
            {selPay && (
              <div style={{background:'#0a0a0a',border:'1px solid #1e1e1e',borderRadius:'6px',padding:'10px',marginBottom:'10px',fontSize:'11px',color:'#888',textAlign:'center',whiteSpace:'pre-line',lineHeight:1.6}}>
                {PAYMENT_INFO[selPay]}
              </div>
            )}
            <button onClick={handleOrder} style={{width:'100%',background:'#c8f500',color:'#000',border:'none',padding:'12px',borderRadius:'6px',fontSize:'15px',letterSpacing:'3px',cursor:'pointer',fontWeight:'bold'}}>
              PLACE ORDER
            </button>
          </div>
        )}
      </div>
    </>
  )
}
