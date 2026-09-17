'use client'
import { useState } from 'react'
import { useStore } from '../lib/store'
import CartDrawer from '../components/CartDrawer'

const PRODUCTS = [
  { id:'1', name:'Acid Wash Graphic Tee',    slug:'acid-wash-graphic-tee',    price:699,  originalPrice:999,  cat:'T-SHIRT',  isNew:true,  sizes:['S','M','L','XL'],      colours:['Black','Olive','White'],  desc:'Acid washed oversized graphic tee. 100% cotton, pre-washed for a lived-in feel.' },
  { id:'2', name:'Slim Fit Black Jogger',    slug:'slim-fit-black-jogger',    price:999,  originalPrice:null, cat:'JOGGER',   isNew:false, sizes:['S','M','L','XL','XXL'],colours:['Black','Grey'],            desc:'Tapered slim-fit jogger with elastic waist and zip pockets.' },
  { id:'3', name:'Compression Gym Vest',     slug:'compression-gym-vest',     price:549,  originalPrice:749,  cat:'GYM WEAR', isNew:true,  sizes:['S','M','L','XL'],      colours:['Black','Navy'],            desc:'High-stretch compression vest. Moisture-wicking fabric keeps you dry.' },
  { id:'4', name:'420 Logo Oversized Tee',   slug:'420-logo-oversized-tee',   price:749,  originalPrice:null, cat:'T-SHIRT',  isNew:false, sizes:['S','M','L','XL'],      colours:['Black','White','Maroon'],  desc:'The signature 420 CLOTHING logo tee. Drop shoulder, heavyweight cotton.' },
  { id:'5', name:'Cargo Lower Pants',        slug:'cargo-lower-pants',        price:899,  originalPrice:1199, cat:'LOWER',    isNew:false, sizes:['S','M','L','XL','XXL'],colours:['Black','Olive'],           desc:'Multi-pocket cargo lower with drawstring waist. Relaxed fit.' },
  { id:'6', name:'Dry Fit Training Shorts',  slug:'dry-fit-training-shorts',  price:649,  originalPrice:null, cat:'GYM WEAR', isNew:true,  sizes:['S','M','L','XL'],      colours:['Black','Navy','Grey'],     desc:'Lightweight dry-fit shorts with inner compression layer.' },
  { id:'7', name:'Printed Streetwear Tee',   slug:'printed-streetwear-tee',   price:799,  originalPrice:1099, cat:'T-SHIRT',  isNew:true,  sizes:['S','M','L','XL'],      colours:['Black','Grey'],            desc:'Bold street-art inspired graphic print on premium heavyweight cotton.' },
  { id:'8', name:'Gym Tank with Back Print', slug:'gym-tank-back-print',      price:499,  originalPrice:null, cat:'GYM WEAR', isNew:false, sizes:['S','M','L','XL','XXL'],colours:['Black','Maroon'],          desc:'Sleeveless gym tank with 420 CLOTHING back print. Racerback cut.' },
]

const COLOURS_HEX: Record<string,string> = {
  Black:'#111', White:'#f0f0f0', Olive:'#4b5320',
  Grey:'#6b7280', Navy:'#1e3a5f', Maroon:'#7c1c1c'
}

const CAT_COLORS: Record<string,{bg:string,color:string,border:string}> = {
  'T-SHIRT':  {bg:'rgba(200,245,0,0.12)',  color:'#c8f500', border:'rgba(200,245,0,0.3)'},
  'JOGGER':   {bg:'rgba(100,180,255,0.1)', color:'#64b4ff', border:'rgba(100,180,255,0.3)'},
  'LOWER':    {bg:'rgba(100,180,255,0.1)', color:'#64b4ff', border:'rgba(100,180,255,0.3)'},
  'GYM WEAR': {bg:'rgba(255,120,60,0.1)',  color:'#ff783c', border:'rgba(255,120,60,0.3)'},
}

export default function HomePage() {
  const [cartOpen, setCartOpen]     = useState(false)
  const [detailProd, setDetailProd] = useState<typeof PRODUCTS[0]|null>(null)
  const [selSize, setSelSize]       = useState('')
  const [selColour, setSelColour]   = useState('')
  const [search, setSearch]         = useState('')
  const [activeCat, setActiveCat]   = useState('ALL')
  const [maxPrice, setMaxPrice]     = useState(1999)
  const [toast, setToast]           = useState('')
  const { addToCart, toggleWish, isWished, count, wishlist } = useStore()

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = PRODUCTS.filter(p => {
    const catMatch = activeCat === 'ALL' || p.cat === activeCat
    const priceMatch = p.price <= maxPrice
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return catMatch && priceMatch && searchMatch
  })

  const handleAddToCart = (p: typeof PRODUCTS[0], size?: string, colour?: string) => {
    const s = size || p.sizes[0]
    const c = colour || p.colours[0]
    addToCart({ id:p.id, name:p.name, price:p.price, size:s, colour:c, quantity:1, slug:p.slug, cat:p.cat })
    showToast(`${p.name} added to cart!`)
    setDetailProd(null)
  }

  const openDetail = (p: typeof PRODUCTS[0]) => {
    setDetailProd(p); setSelSize(p.sizes[0]); setSelColour(p.colours[0])
  }

  const S: Record<string,React.CSSProperties> = {
    page:    { background:'#080808', minHeight:'100vh', color:'#e0e0e0', fontFamily:'Barlow, sans-serif' },
    nav:     { background:'#0e0e0e', borderBottom:'1px solid #1c1c1c', padding:'0 20px', height:'56px', display:'flex', alignItems:'center', gap:'10px', position:'sticky', top:0, zIndex:50 },
    logo:    { fontSize:'22px', letterSpacing:'5px', color:'#c8f500', flexShrink:0, cursor:'pointer' },
    logoSub: { fontSize:'10px', color:'#555', letterSpacing:'3px', marginLeft:'4px', verticalAlign:'middle' },
    search:  { flex:1, background:'#161616', border:'1px solid #222', borderRadius:'6px', padding:'8px 12px', color:'#ccc', outline:'none', fontSize:'13px' },
    iconBtn: { background:'#161616', border:'1px solid #1e1e1e', color:'#888', width:'36px', height:'36px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'16px', position:'relative' as const, flexShrink:0 },
    badge:   { position:'absolute' as const, top:'-6px', right:'-6px', background:'#c8f500', color:'#000', fontSize:'9px', fontWeight:'bold', width:'16px', height:'16px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' },
    loginBtn:{ background:'#c8f500', color:'#000', padding:'7px 14px', borderRadius:'6px', fontSize:'13px', letterSpacing:'2px', fontWeight:'bold', textDecoration:'none', flexShrink:0, cursor:'pointer', border:'none' },
    body:    { display:'flex' as const },
    sidebar: { width:'190px', background:'#0c0c0c', borderRight:'1px solid #181818', padding:'18px 14px', flexShrink:0, position:'sticky' as const, top:'56px', height:'calc(100vh - 56px)', overflowY:'auto' as const },
    sbTitle: { fontSize:'9px', letterSpacing:'3px', color:'#c8f500', marginBottom:'8px', textTransform:'uppercase' as const },
    main:    { flex:1, padding:'18px', overflow:'hidden' },
    hero:    { background:'#111', border:'1px solid #1c1c1c', borderRadius:'12px', padding:'28px', marginBottom:'18px', display:'flex', justifyContent:'space-between', alignItems:'center', overflow:'hidden', position:'relative' as const },
    grid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'12px' },
    card:    { background:'#111', border:'1px solid #1c1c1c', borderRadius:'10px', overflow:'hidden', cursor:'pointer', transition:'transform 0.2s' },
    cardImg: { height:'150px', background:'#161616', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'44px', position:'relative' as const },
    footer:  { background:'#0a0a0a', borderTop:'1px solid #181818', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:'10px' },
    overlay: { position:'fixed' as const, inset:0, background:'rgba(0,0,0,0.88)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
    modal:   { background:'#111', border:'1px solid #222', borderRadius:'12px', width:'100%', maxWidth:'560px', overflow:'hidden' },
    toast:   { position:'fixed' as const, bottom:'24px', right:'24px', background:'#c8f500', color:'#000', fontSize:'12px', fontWeight:'bold', letterSpacing:'2px', padding:'10px 18px', borderRadius:'6px', zIndex:999 },
  }

  return (
    <div style={S.page}>

      {/* TOAST */}
      {toast && <div style={S.toast}>{toast}</div>}

      {/* NAVBAR */}
      <nav style={S.nav}>
        <div style={S.logo}>420 <span style={S.logoSub}>CLOTHING</span></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tees, joggers, gym wear..." style={S.search} />
        <div style={S.iconBtn} title="Wishlist" onClick={()=>showToast(`${wishlist.length} items in wishlist`)}>
          ♡
          {wishlist.length > 0 && <span style={S.badge}>{wishlist.length}</span>}
        </div>
        <div style={S.iconBtn} onClick={()=>setCartOpen(true)} title="Cart">
          🛍
          {count() > 0 && <span style={S.badge}>{count()}</span>}
        </div>
        <button style={S.loginBtn} onClick={()=>window.location.href='/login'}>LOGIN</button>
      </nav>

      <div style={S.body}>

        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={{marginBottom:'18px'}}>
            <p style={S.sbTitle}>Category</p>
            {['ALL','T-SHIRT','JOGGER','LOWER','GYM WEAR'].map(c=>(
              <div key={c} onClick={()=>setActiveCat(c)} style={{padding:'5px 0', fontSize:'11px', color: activeCat===c ? '#c8f500':'#555', cursor:'pointer', letterSpacing:'1px'}}>
                {c==='ALL'?'All Products':c==='T-SHIRT'?'T-Shirts':c==='JOGGER'?'Joggers':c==='LOWER'?'Lowers':'Gym Wear'}
              </div>
            ))}
          </div>
          <div style={{marginBottom:'18px'}}>
            <p style={S.sbTitle}>Price</p>
            <input type="range" min={199} max={1999} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} style={{width:'100%',accentColor:'#c8f500'}} />
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'#444',marginTop:'4px'}}>
              <span>₹199</span><span>Up to ₹{maxPrice}</span>
            </div>
          </div>
          <div style={{marginBottom:'18px'}}>
            <p style={S.sbTitle}>Size</p>
            <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginTop:'4px'}}>
              {['S','M','L','XL','XXL'].map(s=>(
                <span key={s} style={{fontSize:'9px',padding:'3px 7px',border:'1px solid #c8f500',color:'#c8f500',borderRadius:'4px',cursor:'pointer',letterSpacing:'1px'}}>{s}</span>
              ))}
            </div>
          </div>
          <button onClick={()=>{setActiveCat('ALL');setMaxPrice(1999);setSearch('')}} style={{width:'100%',fontSize:'9px',letterSpacing:'2px',color:'#c8f500',background:'none',border:'1px solid rgba(200,245,0,0.3)',padding:'5px',borderRadius:'20px',cursor:'pointer'}}>
            CLEAR FILTERS
          </button>
        </aside>

        {/* MAIN */}
        <main style={S.main}>

          {/* HERO */}
          <div style={S.hero}>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{fontSize:'9px',letterSpacing:'4px',color:'#c8f500',marginBottom:'6px'}}>SUMMER DROP 2025</div>
              <div style={{fontSize:'46px',fontWeight:'bold',letterSpacing:'4px',color:'#fff',lineHeight:1,marginBottom:'8px'}}>
                WEAR THE<br/><span style={{color:'#c8f500'}}>STREETS</span>
              </div>
              <div style={{fontSize:'10px',color:'#555',letterSpacing:'3px',marginBottom:'16px'}}>PRINTED TEES · JOGGERS · GYM WEAR</div>
              <button onClick={()=>setActiveCat('ALL')} style={{background:'#c8f500',color:'#000',border:'none',padding:'10px 22px',borderRadius:'6px',fontSize:'15px',letterSpacing:'3px',cursor:'pointer',fontWeight:'bold'}}>SHOP NOW</button>
              <div style={{display:'flex',gap:'8px',marginTop:'12px',flexWrap:'wrap'}}>
                <span style={{fontSize:'9px',letterSpacing:'2px',padding:'3px 10px',borderRadius:'20px',border:'1px solid #2a2a2a',color:'#444'}}>FREE SHIPPING ₹799+</span>
                <span style={{fontSize:'9px',letterSpacing:'2px',padding:'3px 10px',borderRadius:'20px',border:'1px solid #2a2a2a',color:'#444'}}>COD AVAILABLE</span>
              </div>
            </div>
            <div style={{fontSize:'80px',color:'#1a1a1a',letterSpacing:'6px',fontWeight:'bold',lineHeight:1,textAlign:'right'}}>
              420<br/><span style={{fontSize:'11px',letterSpacing:'5px',color:'#2a2a2a'}}>CLOTHING</span>
            </div>
          </div>

          {/* SEASON CHIPS */}
          <div style={{display:'flex',gap:'8px',marginBottom:'16px',overflowX:'auto',paddingBottom:'4px'}}>
            {['All Drops','Summer 2025','New Arrivals','Bestsellers','Gym Edition'].map((c,i)=>(
              <span key={c} style={{fontSize:'9px',letterSpacing:'2px',padding:'5px 14px',borderRadius:'20px',border:`1px solid ${i===0?'#c8f500':'#222'}`,color:i===0?'#c8f500':'#555',background:i===0?'rgba(200,245,0,0.07)':'#111',cursor:'pointer',flexShrink:0,fontWeight:'600'}}>
                {c}
              </span>
            ))}
          </div>

          {/* HEADER */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
            <div style={{fontSize:'20px',letterSpacing:'4px',color:'#fff',fontWeight:'bold'}}>Products</div>
            <div style={{fontSize:'10px',color:'#444',letterSpacing:'2px'}}>Showing {filtered.length} items</div>
          </div>

          {/* PRODUCT GRID */}
          <div style={S.grid}>
            {filtered.map(p=>{
              const cc = CAT_COLORS[p.cat] || CAT_COLORS['T-SHIRT']
              const wished = isWished(p.id)
              return (
                <div key={p.id} style={S.card} onClick={()=>openDetail(p)}>
                  <div style={S.cardImg}>
                    👕
                    <span style={{position:'absolute',top:'8px',left:'8px',fontSize:'8px',padding:'2px 7px',borderRadius:'20px',background:cc.bg,color:cc.color,border:`1px solid ${cc.border}`,fontWeight:'600'}}>
                      {p.cat}
                    </span>
                    {p.isNew&&<span style={{position:'absolute',top:'8px',right:'8px',background:'#c8f500',color:'#000',fontSize:'7px',padding:'2px 6px',borderRadius:'20px',fontWeight:'bold'}}>NEW</span>}
                    <button
                      onClick={e=>{e.stopPropagation();toggleWish({id:p.id,name:p.name,price:p.price,slug:p.slug,cat:p.cat});showToast(wished?'Removed from wishlist':'Added to wishlist!')}}
                      style={{position:'absolute',bottom:'8px',right:'8px',width:'26px',height:'26px',background:'#1a1a1a',border:`1px solid ${wished?'#c8f500':'#2a2a2a'}`,color:wished?'#c8f500':'#555',borderRadius:'50%',cursor:'pointer',fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center'}}
                    >
                      {wished?'♥':'♡'}
                    </button>
                  </div>
                  <div style={{padding:'10px 12px 6px'}}>
                    <div style={{fontSize:'11px',fontWeight:600,color:'#ccc',marginBottom:'4px'}}>{p.name}</div>
                    <div style={{display:'flex',gap:'4px',marginBottom:'6px'}}>
                      {p.colours.map(c=>(
                        <div key={c} title={c} style={{width:'10px',height:'10px',borderRadius:'50%',background:COLOURS_HEX[c]||'#888',border:'1px solid #2a2a2a'}} />
                      ))}
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div>
                        <span style={{fontSize:'18px',color:'#c8f500',fontWeight:'bold'}}>₹{p.price}</span>
                        {p.originalPrice&&<span style={{fontSize:'10px',color:'#444',textDecoration:'line-through',marginLeft:'4px'}}>₹{p.originalPrice}</span>}
                      </div>
                      <button
                        onClick={e=>{e.stopPropagation();handleAddToCart(p)}}
                        style={{fontSize:'8px',padding:'4px 9px',border:'1px solid #c8f500',background:'rgba(200,245,0,0.08)',color:'#c8f500',borderRadius:'5px',cursor:'pointer',fontWeight:'bold',letterSpacing:'1px'}}
                      >+ CART</button>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'4px',padding:'0 12px 10px',flexWrap:'wrap'}}>
                    {p.sizes.map(s=>(
                      <span key={s} onClick={e=>{e.stopPropagation()}} style={{fontSize:'8px',padding:'2px 6px',border:'1px solid #1e1e1e',color:'#444',borderRadius:'3px',letterSpacing:'1px'}}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* PAYMENT STRIP */}
          <div style={{background:'#0f0f0f',border:'1px solid #1c1c1c',borderRadius:'10px',padding:'14px 20px',marginTop:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'10px'}}>
            <span style={{fontSize:'9px',letterSpacing:'3px',color:'#444'}}>ACCEPTED PAYMENTS</span>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <span style={{fontSize:'11px',fontWeight:'bold',padding:'4px 14px',borderRadius:'20px',background:'rgba(100,180,255,0.1)',color:'#64b4ff',border:'1px solid rgba(100,180,255,0.25)'}}>UPI</span>
              <span style={{fontSize:'11px',fontWeight:'bold',padding:'4px 14px',borderRadius:'20px',background:'rgba(255,120,60,0.1)',color:'#ff783c',border:'1px solid rgba(255,120,60,0.25)'}}>QR Scanner</span>
              <span style={{fontSize:'11px',fontWeight:'bold',padding:'4px 14px',borderRadius:'20px',background:'rgba(200,245,0,0.1)',color:'#c8f500',border:'1px solid rgba(200,245,0,0.25)'}}>Cash on Delivery</span>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={{fontSize:'16px',letterSpacing:'4px',color:'#333',fontWeight:'bold'}}>420 CLOTHING</div>
        <div style={{display:'flex',gap:'16px'}}>
          {['About','Size Guide','Returns','Contact'].map(l=>(
            <span key={l} style={{fontSize:'10px',color:'#333',letterSpacing:'2px',cursor:'pointer'}}>{l}</span>
          ))}
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <a href="#" style={{width:'28px',height:'28px',border:'1px solid #1e1e1e',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',color:'#444',textDecoration:'none',fontSize:'14px'}}>📷</a>
          <a href="#" style={{width:'28px',height:'28px',border:'1px solid #1e1e1e',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center',color:'#444',textDecoration:'none',fontSize:'14px'}}>💬</a>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL */}
      {detailProd && (
        <div style={S.overlay} onClick={()=>setDetailProd(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{background:'#0e0e0e',padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #1c1c1c'}}>
              <span style={{fontSize:'16px',letterSpacing:'4px',color:'#c8f500',fontWeight:'bold'}}>{detailProd.name.toUpperCase()}</span>
              <button onClick={()=>setDetailProd(null)} style={{background:'none',border:'none',color:'#555',fontSize:'20px',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{padding:'20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
              <div style={{background:'#161616',borderRadius:'8px',height:'220px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'60px'}}>👕</div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div>
                  <span style={{fontSize:'28px',color:'#c8f500',fontWeight:'bold'}}>₹{detailProd.price}</span>
                  {detailProd.originalPrice&&<span style={{fontSize:'13px',color:'#444',textDecoration:'line-through',marginLeft:'6px'}}>₹{detailProd.originalPrice}</span>}
                  {detailProd.originalPrice&&<span style={{marginLeft:'6px',fontSize:'11px',color:'#44cc88'}}>Save ₹{detailProd.originalPrice-detailProd.price}</span>}
                </div>
                <p style={{fontSize:'12px',color:'#666',lineHeight:1.7}}>{detailProd.desc}</p>
                <div>
                  <p style={{fontSize:'9px',letterSpacing:'2px',color:'#444',marginBottom:'6px'}}>SELECT SIZE</p>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {detailProd.sizes.map(s=>(
                      <span key={s} onClick={()=>setSelSize(s)} style={{fontSize:'11px',padding:'5px 12px',border:`1px solid ${selSize===s?'#c8f500':'#222'}`,color:selSize===s?'#c8f500':'#555',borderRadius:'4px',cursor:'pointer',letterSpacing:'1px',background:selSize===s?'rgba(200,245,0,0.08)':'transparent'}}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{fontSize:'9px',letterSpacing:'2px',color:'#444',marginBottom:'6px'}}>SELECT COLOUR</p>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {detailProd.colours.map(c=>(
                      <span key={c} onClick={()=>setSelColour(c)} style={{fontSize:'11px',padding:'4px 10px',border:`1px solid ${selColour===c?'#c8f500':'#222'}`,color:selColour===c?'#c8f500':'#555',borderRadius:'4px',cursor:'pointer',letterSpacing:'1px',background:selColour===c?'rgba(200,245,0,0.08)':'transparent',display:'flex',alignItems:'center',gap:'5px'}}>
                        <span style={{width:'10px',height:'10px',borderRadius:'50%',background:COLOURS_HEX[c]||'#888',display:'inline-block'}} />{c}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={()=>handleAddToCart(detailProd, selSize, selColour)}
                  style={{background:'#c8f500',color:'#000',border:'none',padding:'12px',borderRadius:'6px',fontSize:'15px',letterSpacing:'3px',cursor:'pointer',fontWeight:'bold',marginTop:'auto'}}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} />
    </div>
  )
}
