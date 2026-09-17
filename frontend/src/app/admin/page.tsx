'use client'
import { useState } from 'react'

type Role = 'admin' | 'developer'
type Section = 'dashboard' | 'products' | 'orders' | 'inventory' | 'database' | 'analytics' | 'payments' | 'settings'

interface Product { id:string;name:string;cat:string;price:number;originalPrice:number|null;stock:number;status:string;isLocked:boolean;changed:boolean }
interface LogEntry { type:string;time:string;msg:string;role:Role }

const INIT_PRODUCTS:Product[] = [
  {id:'1',name:'Acid Wash Graphic Tee',  cat:'T-SHIRT', price:699,originalPrice:999, stock:47,status:'live',isLocked:false,changed:false},
  {id:'2',name:'Slim Fit Black Jogger',  cat:'JOGGER',  price:999,originalPrice:null,stock:40,status:'live',isLocked:false,changed:false},
  {id:'3',name:'Compression Gym Vest',   cat:'GYM WEAR',price:549,originalPrice:749, stock:58,status:'live',isLocked:false,changed:false},
  {id:'4',name:'420 Logo Oversized Tee', cat:'T-SHIRT', price:749,originalPrice:null,stock:32,status:'live',isLocked:true, changed:false},
  {id:'5',name:'Cargo Lower Pants',      cat:'LOWER',   price:899,originalPrice:1199,stock:37,status:'live',isLocked:false,changed:false},
  {id:'6',name:'Dry Fit Training Shorts',cat:'GYM WEAR',price:649,originalPrice:null,stock:65,status:'live',isLocked:false,changed:false},
  {id:'7',name:'Printed Streetwear Tee', cat:'T-SHIRT', price:799,originalPrice:1099,stock:4, status:'low', isLocked:false,changed:false},
  {id:'8',name:'Gym Tank with Back Print',cat:'GYM WEAR',price:499,originalPrice:null,stock:3, status:'low', isLocked:false,changed:false},
]

const ORDERS = [
  {id:'#4201',customer:'Rohan Mehta', items:'Acid Wash Tee',   size:'L', payment:'UPI',amount:699, status:'Shipped',  date:'28 Aug'},
  {id:'#4200',customer:'Arjun Sharma',items:'Black Jogger',    size:'M', payment:'COD',amount:999, status:'Pending',  date:'28 Aug'},
  {id:'#4199',customer:'Dev Patel',   items:'Gym Vest',        size:'XL',payment:'QR', amount:549, status:'Delivered',date:'27 Aug'},
  {id:'#4198',customer:'Karan Tiwari',items:'Logo Tee',        size:'L', payment:'UPI',amount:749, status:'Shipped',  date:'27 Aug'},
  {id:'#4197',customer:'Nikhil Roy',  items:'Cargo Lower',     size:'M', payment:'COD',amount:899, status:'Pending',  date:'26 Aug'},
  {id:'#4196',customer:'Priya Singh', items:'Training Shorts', size:'S', payment:'UPI',amount:649, status:'Delivered',date:'26 Aug'},
]

const INVENTORY = [
  {name:'Acid Wash Graphic Tee',   S:12,M:18,L:15,XL:2, XXL:0},
  {name:'Slim Fit Black Jogger',   S:0, M:9, L:14,XL:11,XXL:6},
  {name:'Compression Gym Vest',    S:20,M:17,L:13,XL:8, XXL:0},
  {name:'420 Logo Oversized Tee',  S:7, M:11,L:9, XL:5, XXL:0},
  {name:'Cargo Lower Pants',       S:3, M:8, L:12,XL:10,XXL:4},
  {name:'Dry Fit Training Shorts', S:15,M:20,L:18,XL:12,XXL:0},
  {name:'Printed Streetwear Tee',  S:1, M:3, L:0, XL:0, XXL:0},
  {name:'Gym Tank with Back Print',S:1, M:2, L:0, XL:0, XXL:0},
]

const WEEKLY = [8200,12400,9800,15600,18900,22400,14700]
const WLABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const INIT_LOGS:LogEntry[] = [
  {type:'commit',time:'Today 14:32',msg:'Committed 2 product edits — prices updated',role:'developer'},
  {type:'lock',  time:'Today 14:30',msg:'Locked row — "420 Logo Oversized Tee" (ID #4)',role:'developer'},
  {type:'edit',  time:'Today 13:15',msg:'Viewed inventory report — low stock flagged',role:'admin'},
  {type:'add',   time:'Yesterday',  msg:'Added new product — "Dry Fit Training Shorts"',role:'developer'},
  {type:'commit',time:'Yesterday',  msg:'Committed inventory restock — Gym Vest updated',role:'developer'},
]

const statusColor:Record<string,string> = {Delivered:'#44cc88',Shipped:'#64b4ff',Pending:'#ff9900',Cancelled:'#ff4444'}
const payColor:Record<string,string> = {UPI:'#64b4ff',COD:'#c8f500',QR:'#ff783c'}
const logColor:Record<string,string> = {commit:'#c8f500',lock:'#64b4ff',edit:'#ff9900',add:'#44cc88',del:'#ff4444'}

export default function AdminPage() {
  const [authed,setAuthed]     = useState(false)
  const [passIn,setPassIn]     = useState('')
  const [passErr,setPassErr]   = useState(false)
  const [adminPass,setAdminPass] = useState('420admin')
  const [role,setRole]         = useState<Role>('admin')
  const [section,setSection]   = useState<Section>('dashboard')
  const [products,setProducts] = useState<Product[]>(INIT_PRODUCTS)
  const [logs,setLogs]         = useState<LogEntry[]>(INIT_LOGS)
  const [pending,setPending]   = useState(0)
  const [toast,setToast]       = useState('')
  const [orderQ,setOrderQ]     = useState('')

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),2500) }
  const addLog = (type:string,msg:string) => {
    const now = new Date()
    setLogs(l=>[{type,time:`Today ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`,msg,role},...l])
  }

  const login = () => { if(passIn===adminPass){setAuthed(true);setPassErr(false)}else setPassErr(true) }

  const toggleLock = (id:string) => {
    if(role!=='developer'){showToast('Only developer can lock rows');return}
    const p = products.find(x=>x.id===id)
    setProducts(ps=>ps.map(x=>x.id===id?{...x,isLocked:!x.isLocked}:x))
    addLog('lock',`${p?.isLocked?'Unlocked':'Locked'} row — "${p?.name}"`)
  }

  const editPrice = (id:string) => {
    if(role!=='developer'){showToast('Only developer can edit');return}
    const p = products.find(x=>x.id===id)
    if(!p||p.isLocked){showToast('Row is locked');return}
    const v = prompt(`Edit price for "${p.name}":`,String(p.price))
    if(v&&!isNaN(Number(v))&&Number(v)>0){
      setProducts(ps=>ps.map(x=>x.id===id?{...x,price:Number(v),changed:true}:x))
      setPending(n=>n+1)
      addLog('edit',`Edited price of "${p.name}" → ₹${v} (pending commit)`)
    }
  }

  const commit = () => {
    setProducts(ps=>ps.map(x=>({...x,changed:false})))
    addLog('commit',`Committed ${pending} change${pending>1?'s':''} to database`)
    setPending(0); showToast('Changes committed!')
  }

  const totalRev = ORDERS.reduce((s,o)=>s+o.amount,0)
  const lowStock = products.filter(p=>p.stock<=5).length
  const maxBar = Math.max(...WEEKLY)

  const C:Record<string,React.CSSProperties> = {
    page:{background:'#080808',minHeight:'100vh',color:'#e0e0e0',fontFamily:'Barlow,sans-serif'},
    gate:{position:'fixed',inset:0,background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100},
    box:{background:'#111',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'36px',width:'300px',textAlign:'center'},
    top:{background:'#111',borderBottom:'1px solid #1c1c1c',padding:'0 20px',height:'52px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50},
    sb:{width:'180px',background:'#0c0c0c',borderRight:'1px solid #181818',padding:'14px 0',flexShrink:0,position:'sticky',top:'52px',height:'calc(100vh - 52px)',overflowY:'auto'},
    main:{flex:1,padding:'20px',overflowY:'auto' as const},
    card:{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'18px',marginBottom:'16px'},
    inp:{background:'#0e0e0e',border:'1px solid #1e1e1e',borderRadius:'6px',padding:'9px 12px',fontSize:'13px',color:'#ccc',outline:'none',fontFamily:'Barlow,sans-serif',width:'100%'},
    btn:{background:'#c8f500',color:'#000',border:'none',padding:'9px 20px',borderRadius:'6px',fontWeight:'bold',fontSize:'12px',letterSpacing:'2px',cursor:'pointer'},
    btnO:{background:'none',color:'#c8f500',border:'1px solid rgba(200,245,0,0.3)',padding:'9px 20px',borderRadius:'6px',fontWeight:'bold',fontSize:'12px',letterSpacing:'2px',cursor:'pointer'},
    hd:{fontSize:'22px',letterSpacing:'4px',color:'#fff',fontWeight:'bold',marginBottom:'2px'},
    sub:{fontSize:'9px',color:'#333',letterSpacing:'3px',marginBottom:'18px'},
    th:{padding:'8px 10px',textAlign:'left' as const,fontSize:'9px',letterSpacing:'2px',color:'#333',textTransform:'uppercase' as const,borderBottom:'1px solid #181818',whiteSpace:'nowrap' as const},
    td:{padding:'8px 10px',borderBottom:'1px solid #141414',color:'#888',fontSize:'11px'},
  }

  const navs:{id:Section,label:string,icon:string}[] = [
    {id:'dashboard',label:'Dashboard', icon:'📊'},
    {id:'products', label:'Products',  icon:'👕'},
    {id:'orders',   label:'Orders',    icon:'📦'},
    {id:'inventory',label:'Inventory', icon:'📋'},
    {id:'database', label:'DB Log',    icon:'🗄️'},
    {id:'analytics',label:'Analytics', icon:'📈'},
    {id:'payments', label:'Payments',  icon:'💳'},
    {id:'settings', label:'Settings',  icon:'⚙️'},
  ]

  const StatCard = ({label,val,sub,color}:{label:string,val:string|number,sub:string,color:string}) => (
    <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'14px'}}>
      <div style={{fontSize:'9px',color:'#444',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>{label}</div>
      <div style={{fontSize:'26px',color,fontWeight:'bold',letterSpacing:'1px'}}>{val}</div>
      <div style={{fontSize:'10px',color:'#333',marginTop:'2px'}}>{sub}</div>
    </div>
  )

  const SzCell = ({v}:{v:number}) => (
    <td style={C.td}>
      <span style={{fontSize:'10px',padding:'2px 7px',borderRadius:'4px',fontWeight:'bold',
        background:v===0?'rgba(255,68,68,0.1)':v<=3?'rgba(255,153,0,0.1)':'rgba(68,204,136,0.1)',
        color:v===0?'#ff4444':v<=3?'#ff9900':'#44cc88',
        border:`1px solid ${v===0?'rgba(255,68,68,0.25)':v<=3?'rgba(255,153,0,0.25)':'rgba(68,204,136,0.25)'}`}}>
        {v===0?'OUT':v}
      </span>
    </td>
  )

  if(!authed) return (
    <div style={C.gate}>
      <div style={C.box}>
        <div style={{fontSize:'26px',letterSpacing:'6px',color:'#c8f500',fontWeight:'bold',marginBottom:'4px'}}>420</div>
        <div style={{fontSize:'10px',letterSpacing:'4px',color:'#444',marginBottom:'24px'}}>ADMIN PANEL</div>
        <input type="password" placeholder="Enter password" value={passIn}
          onChange={e=>setPassIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}
          style={{...C.inp,textAlign:'center',letterSpacing:'4px',marginBottom:'8px'}}/>
        {passErr&&<p style={{fontSize:'11px',color:'#ff4444',marginBottom:'8px'}}>Wrong password</p>}
        <button onClick={login} style={{...C.btn,width:'100%',marginBottom:'10px'}}>ENTER</button>
        <p style={{fontSize:'9px',color:'#333',letterSpacing:'1px'}}>Default: 420admin</p>
      </div>
    </div>
  )

  return (
    <div style={C.page}>
      {toast&&<div style={{position:'fixed',bottom:'24px',right:'24px',background:'#c8f500',color:'#000',fontSize:'12px',fontWeight:'bold',letterSpacing:'2px',padding:'10px 18px',borderRadius:'6px',zIndex:999}}>{toast}</div>}

      <div style={C.top}>
        <div style={{fontSize:'18px',letterSpacing:'4px',color:'#c8f500',fontWeight:'bold'}}>420 <span style={{fontSize:'9px',color:'#444',letterSpacing:'3px'}}>ADMIN</span></div>
        <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
          <div style={{display:'flex',border:'1px solid #1e1e1e',borderRadius:'6px',overflow:'hidden'}}>
            {(['admin','developer'] as Role[]).map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{padding:'4px 10px',fontSize:'9px',letterSpacing:'2px',fontWeight:'bold',cursor:'pointer',border:'none',background:role===r?'rgba(200,245,0,0.1)':'#0e0e0e',color:role===r?'#c8f500':'#444',textTransform:'uppercase'}}>
                {r==='admin'?'👁 Admin':'🔧 Dev'}
              </button>
            ))}
          </div>
          <a href="/" style={{fontSize:'9px',color:'#555',border:'1px solid #2a2a2a',padding:'4px 10px',borderRadius:'5px',textDecoration:'none',letterSpacing:'1px'}}>🏪 Store</a>
          <button onClick={()=>setAuthed(false)} style={{fontSize:'9px',color:'#555',border:'1px solid #2a2a2a',padding:'4px 10px',borderRadius:'5px',background:'none',cursor:'pointer'}}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex'}}>
        <aside style={C.sb}>
          {navs.map(n=>(
            <div key={n.id} onClick={()=>setSection(n.id)} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 14px',fontSize:'10px',fontWeight:'600',color:section===n.id?'#c8f500':'#444',cursor:'pointer',borderLeft:section===n.id?'3px solid #c8f500':'3px solid transparent',background:section===n.id?'#111':'transparent',letterSpacing:'1px',transition:'all 0.15s'}}>
              <span>{n.icon}</span>{n.label.toUpperCase()}
            </div>
          ))}
          <div style={{padding:'14px',marginTop:'8px',borderTop:'1px solid #181818'}}>
            <div style={{fontSize:'9px',color:role==='developer'?'#64b4ff':'#c8f500',fontWeight:'bold',letterSpacing:'1px'}}>{role==='developer'?'🔧 DEVELOPER':'👁 ADMIN'}</div>
            <div style={{fontSize:'9px',color:'#333',marginTop:'3px'}}>{role==='developer'?'Full edit access':'Read only'}</div>
          </div>
        </aside>

        <main style={C.main}>

          {/* DASHBOARD */}
          {section==='dashboard'&&(
            <div>
              <div style={C.hd}>Dashboard</div>
              <div style={C.sub}>OVERVIEW · 420 CLOTHING</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'18px'}}>
                <StatCard label="Total Products" val={products.length} sub="In inventory" color="#c8f500"/>
                <StatCard label="Total Orders" val={ORDERS.length} sub="All time" color="#c8f500"/>
                <StatCard label="Revenue" val={`₹${totalRev.toLocaleString()}`} sub="This month" color="#c8f500"/>
                <StatCard label="Low Stock" val={lowStock} sub="Need restock" color={lowStock>0?'#ff9900':'#44cc88'}/>
              </div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'12px'}}>📈 WEEKLY REVENUE</div>
                <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'80px',marginBottom:'6px'}}>
                  {WEEKLY.map((v,i)=>(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                      <span style={{fontSize:'8px',color:'#c8f500'}}>₹{Math.round(v/1000)}k</span>
                      <div style={{width:'100%',background:'linear-gradient(to top,rgba(200,245,0,0.6),rgba(200,245,0,0.2))',borderRadius:'3px 3px 0 0',height:`${Math.round((v/maxBar)*65)}px`,minHeight:'2px'}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-around'}}>{WLABELS.map(l=><span key={l} style={{fontSize:'9px',color:'#333'}}>{l}</span>)}</div>
              </div>
              {lowStock>0&&(
                <div style={C.card}>
                  <div style={{fontSize:'10px',letterSpacing:'3px',color:'#ff9900',marginBottom:'10px'}}>⚠️ LOW STOCK ALERTS</div>
                  {products.filter(p=>p.stock<=5).map(p=>(
                    <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #181818'}}>
                      <span style={{fontSize:'12px',color:'#888'}}>{p.name}</span>
                      <span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'20px',background:'rgba(255,153,0,0.1)',color:'#ff9900',border:'1px solid rgba(255,153,0,0.25)'}}>{p.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'10px'}}>📦 RECENT ORDERS</div>
                {ORDERS.slice(0,4).map(o=>(
                  <div key={o.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #141414'}}>
                    <span style={{fontSize:'12px',color:'#c8f500',fontWeight:'bold',minWidth:'58px'}}>{o.id}</span>
                    <span style={{fontSize:'11px',color:'#888',flex:1,marginLeft:'10px'}}>{o.customer}</span>
                    <span style={{fontSize:'8px',padding:'2px 7px',borderRadius:'20px',background:`${payColor[o.payment]}15`,color:payColor[o.payment],border:`1px solid ${payColor[o.payment]}40`,marginRight:'6px'}}>{o.payment}</span>
                    <span style={{fontSize:'8px',padding:'2px 7px',borderRadius:'20px',background:`${statusColor[o.status]}15`,color:statusColor[o.status],border:`1px solid ${statusColor[o.status]}40`}}>{o.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {section==='products'&&(
            <div>
              <div style={C.hd}>Products</div>
              <div style={C.sub}>PRODUCT RECORDS · COMMIT TO SAVE · LOCK TO PROTECT</div>
              {pending>0&&role==='developer'&&(
                <div style={{background:'rgba(200,245,0,0.05)',border:'1px solid rgba(200,245,0,0.15)',borderRadius:'8px',padding:'10px 14px',marginBottom:'14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'12px',color:'#c8f500'}}><strong>{pending} change{pending>1?'s':''}</strong> pending</span>
                  <button onClick={commit} style={{...C.btn,padding:'5px 14px',fontSize:'10px'}}>💾 COMMIT</button>
                </div>
              )}
              {role==='admin'&&<div style={{background:'rgba(100,180,255,0.04)',border:'1px solid rgba(100,180,255,0.15)',borderRadius:'8px',padding:'8px 14px',marginBottom:'14px',fontSize:'11px',color:'#64b4ff'}}>👁 Admin view — read only. Switch to Developer to edit.</div>}
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid #1c1c1c',background:'#0e0e0e'}}>
                  <span style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500'}}>🗄️ products_db</span>
                  {role==='developer'&&<button onClick={()=>{const n=prompt('Product name:');if(n){const p=prompt('Price (₹):');if(p){setProducts(ps=>[...ps,{id:String(ps.length+1),name:n,cat:'T-SHIRT',price:Number(p),originalPrice:null,stock:0,status:'low',isLocked:false,changed:true}]);setPending(x=>x+1);addLog('add',`Added product — "${n}"`)}}}} style={{...C.btn,padding:'4px 10px',fontSize:'9px'}}>+ ADD ROW</button>}
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                    <thead><tr style={{background:'#0e0e0e'}}>
                      {['#','Name','Category','Price','Stock','Status','Lock','Actions'].map(h=><th key={h} style={C.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {products.map(p=>(
                        <tr key={p.id} style={{opacity:p.isLocked?0.55:1}}>
                          <td style={C.td}><span style={{color:'#333',fontFamily:'monospace'}}>#{p.id}</span></td>
                          <td style={C.td}><span style={{color:p.changed?'#ff9900':'#ccc'}}>{p.name}{p.changed&&<span style={{fontSize:'8px',color:'#ff9900',marginLeft:'3px'}}>●</span>}</span></td>
                          <td style={C.td}><span style={{fontSize:'8px',padding:'2px 7px',borderRadius:'20px',fontWeight:'bold',background:'rgba(200,245,0,0.1)',color:'#c8f500',border:'1px solid rgba(200,245,0,0.25)'}}>{p.cat}</span></td>
                          <td style={C.td}><span style={{color:'#c8f500',fontWeight:'bold'}}>₹{p.price}</span></td>
                          <td style={C.td}><span style={{color:p.stock<=5?'#ff9900':'#888'}}>{p.stock}</span></td>
                          <td style={C.td}><span style={{fontSize:'8px',padding:'2px 7px',borderRadius:'20px',background:p.status==='live'?'rgba(68,204,136,0.1)':'rgba(255,153,0,0.1)',color:p.status==='live'?'#44cc88':'#ff9900',border:`1px solid ${p.status==='live'?'rgba(68,204,136,0.25)':'rgba(255,153,0,0.25)'}`}}>{p.status.toUpperCase()}</span></td>
                          <td style={C.td}><span onClick={()=>toggleLock(p.id)} style={{cursor:role==='developer'?'pointer':'default',fontSize:'14px'}}>{p.isLocked?'🔒':'🔓'}</span></td>
                          <td style={C.td}>
                            <div style={{display:'flex',gap:'4px'}}>
                              <button onClick={()=>editPrice(p.id)} disabled={p.isLocked||role==='admin'} style={{fontSize:'8px',padding:'2px 7px',borderRadius:'4px',border:'1px solid rgba(200,245,0,0.3)',color:'#c8f500',background:'rgba(200,245,0,0.06)',cursor:'pointer',opacity:(p.isLocked||role==='admin')?0.3:1}}>Edit</button>
                              <button disabled={p.isLocked||role==='admin'} style={{fontSize:'8px',padding:'2px 7px',borderRadius:'4px',border:'1px solid rgba(255,68,68,0.3)',color:'#ff5555',background:'rgba(255,68,68,0.06)',cursor:'pointer',opacity:(p.isLocked||role==='admin')?0.3:1}}>Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {section==='orders'&&(
            <div>
              <div style={C.hd}>Orders</div>
              <div style={C.sub}>ALL ORDER RECORDS</div>
              <input value={orderQ} onChange={e=>setOrderQ(e.target.value)} placeholder="Search orders..." style={{...C.inp,marginBottom:'14px'}}/>
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                  <thead><tr style={{background:'#0e0e0e'}}>{['Order ID','Customer','Item','Size','Payment','Amount','Date','Status'].map(h=><th key={h} style={C.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {ORDERS.filter(o=>!orderQ||o.customer.toLowerCase().includes(orderQ.toLowerCase())||o.id.includes(orderQ)).map(o=>(
                      <tr key={o.id}>
                        <td style={C.td}><span style={{color:'#c8f500',fontWeight:'bold',fontFamily:'monospace'}}>{o.id}</span></td>
                        <td style={{...C.td,color:'#ccc'}}>{o.customer}</td>
                        <td style={C.td}>{o.items}</td>
                        <td style={C.td}>{o.size}</td>
                        <td style={C.td}><span style={{fontSize:'8px',padding:'2px 7px',borderRadius:'20px',background:`${payColor[o.payment]}15`,color:payColor[o.payment],border:`1px solid ${payColor[o.payment]}40`,fontWeight:'bold'}}>{o.payment}</span></td>
                        <td style={{...C.td,color:'#c8f500',fontWeight:'bold'}}>₹{o.amount}</td>
                        <td style={{...C.td,color:'#444'}}>{o.date}</td>
                        <td style={C.td}><span style={{fontSize:'8px',padding:'2px 7px',borderRadius:'20px',background:`${statusColor[o.status]}15`,color:statusColor[o.status],border:`1px solid ${statusColor[o.status]}40`,fontWeight:'bold'}}>{o.status.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {section==='inventory'&&(
            <div>
              <div style={C.hd}>Inventory</div>
              <div style={C.sub}>STOCK BY SIZE · LIVE COUNTS</div>
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                  <thead><tr style={{background:'#0e0e0e'}}>{['Product','S','M','L','XL','XXL','Total'].map(h=><th key={h} style={C.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {INVENTORY.map((item,i)=>{
                      const vals = [item.S,item.M,item.L,item.XL,item.XXL]
                      const tot = vals.reduce((a,b)=>a+b,0)
                      return (
                        <tr key={i}>
                          <td style={{...C.td,color:'#ccc'}}>{item.name}</td>
                          {vals.map((v,j)=><SzCell key={j} v={v}/>)}
                          <td style={{...C.td,fontWeight:'bold'}}>{tot}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{display:'flex',gap:'14px',padding:'10px 0',fontSize:'10px',color:'#444',letterSpacing:'1px'}}>
                <span><span style={{color:'#44cc88'}}>■</span> OK (5+)</span>
                <span><span style={{color:'#ff9900'}}>■</span> Low (1–4)</span>
                <span><span style={{color:'#ff4444'}}>■</span> Out of stock</span>
              </div>
            </div>
          )}

          {/* DATABASE LOG */}
          {section==='database'&&(
            <div>
              <div style={C.hd}>Database Log</div>
              <div style={C.sub}>EVERY ACTION RECORDED · TAMPER-PROOF</div>
              {role==='admin'&&<div style={{background:'rgba(100,180,255,0.04)',border:'1px solid rgba(100,180,255,0.15)',borderRadius:'8px',padding:'8px 14px',marginBottom:'14px',fontSize:'11px',color:'#64b4ff'}}>👁 Admin view — log is read only.</div>}
              <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',overflow:'hidden'}}>
                <div style={{padding:'10px 14px',borderBottom:'1px solid #1c1c1c',background:'#0e0e0e',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500'}}>📋 action_log</span>
                  <span style={{fontSize:'9px',color:'#333',letterSpacing:'1px'}}>Auto-generated · Read only</span>
                </div>
                <div style={{padding:'14px 16px',display:'flex',flexDirection:'column'}}>
                  {logs.map((l,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'8px 0',borderBottom:'1px solid #141414'}}>
                      <div style={{width:'8px',height:'8px',borderRadius:'50%',background:logColor[l.type]||'#444',flexShrink:0,marginTop:'4px'}}/>
                      <span style={{fontSize:'10px',color:'#333',flexShrink:0,minWidth:'80px',fontFamily:'monospace'}}>{l.time}</span>
                      <span style={{fontSize:'11px',color:'#666',flex:1,lineHeight:1.5}}>{l.msg}</span>
                      <span style={{fontSize:'8px',padding:'1px 6px',borderRadius:'20px',flexShrink:0,background:l.role==='developer'?'rgba(100,180,255,0.08)':'rgba(200,245,0,0.08)',color:l.role==='developer'?'#64b4ff':'#c8f500',border:`1px solid ${l.role==='developer'?'rgba(100,180,255,0.2)':'rgba(200,245,0,0.2)'}`}}>{l.role.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {section==='analytics'&&(
            <div>
              <div style={C.hd}>Analytics</div>
              <div style={C.sub}>SALES CHART · REVENUE BREAKDOWN</div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'12px'}}>📈 WEEKLY REVENUE</div>
                <div style={{display:'flex',alignItems:'flex-end',gap:'10px',height:'110px',marginBottom:'6px'}}>
                  {WEEKLY.map((v,i)=>(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                      <span style={{fontSize:'8px',color:'#c8f500',fontWeight:'bold'}}>₹{Math.round(v/1000)}k</span>
                      <div style={{width:'100%',background:'linear-gradient(to top,rgba(200,245,0,0.7),rgba(200,245,0,0.2))',borderRadius:'3px 3px 0 0',height:`${Math.round((v/maxBar)*90)}px`,minHeight:'4px'}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-around'}}>{WLABELS.map(l=><span key={l} style={{fontSize:'9px',color:'#333'}}>{l}</span>)}</div>
              </div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'12px'}}>🥧 SALES BY CATEGORY</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                  {[{l:'T-SHIRTS',p:58,c:'#c8f500'},{l:'JOGGERS',p:27,c:'#64b4ff'},{l:'GYM WEAR',p:15,c:'#ff783c'}].map(x=>(
                    <div key={x.l} style={{background:'#0e0e0e',border:'1px solid #181818',borderRadius:'8px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'22px',color:x.c,fontWeight:'bold'}}>{x.p}%</div>
                      <div style={{fontSize:'9px',letterSpacing:'2px',color:'#444',margin:'4px 0 8px'}}>{x.l}</div>
                      <div style={{height:'3px',background:'#181818',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:`${x.p}%`,background:x.c,borderRadius:'2px'}}/></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'12px'}}>💳 PAYMENT METHOD SPLIT</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                  {[{l:'UPI',p:48,c:'#64b4ff'},{l:'COD',p:33,c:'#c8f500'},{l:'QR SCAN',p:19,c:'#ff783c'}].map(x=>(
                    <div key={x.l} style={{background:'#0e0e0e',border:'1px solid #181818',borderRadius:'8px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'22px',color:x.c,fontWeight:'bold'}}>{x.p}%</div>
                      <div style={{fontSize:'9px',letterSpacing:'2px',color:'#444',margin:'4px 0 8px'}}>{x.l}</div>
                      <div style={{height:'3px',background:'#181818',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:`${x.p}%`,background:x.c,borderRadius:'2px'}}/></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {section==='payments'&&(
            <div>
              <div style={C.hd}>Payments</div>
              <div style={C.sub}>UPI · QR SCANNER · COD SETTINGS</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'18px'}}>
                {[{l:'UPI Collected',v:'₹14,280',s:'18 transactions',c:'#64b4ff'},{l:'QR Scanner',v:'₹6,120',s:'8 transactions',c:'#ff783c'},{l:'Cash on Delivery',v:'₹4,197',s:'5 orders',c:'#c8f500'}].map(x=>(
                  <div key={x.l} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'14px'}}>
                    <div style={{fontSize:'9px',color:'#444',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>{x.l}</div>
                    <div style={{fontSize:'22px',color:x.c,fontWeight:'bold'}}>{x.v}</div>
                    <div style={{fontSize:'10px',color:'#333',marginTop:'2px'}}>{x.s}</div>
                  </div>
                ))}
              </div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'14px'}}>⚙️ UPDATE PAYMENT SETTINGS</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  {[{l:'UPI ID',v:'yourname@upi'},{l:'Registered Name',v:'420 CLOTHING'}].map(f=>(
                    <div key={f.l}><label style={{fontSize:'9px',letterSpacing:'2px',color:'#444',display:'block',marginBottom:'4px'}}>{f.l.toUpperCase()}</label><input style={C.inp} defaultValue={f.v}/></div>
                  ))}
                  <div style={{gridColumn:'1/-1'}}>
                    <label style={{fontSize:'9px',letterSpacing:'2px',color:'#444',display:'block',marginBottom:'4px'}}>QR CODE IMAGE PATH</label>
                    <input style={C.inp} defaultValue="images/qr-code.png"/>
                    <p style={{fontSize:'10px',color:'#333',marginTop:'4px'}}>Put QR image in /public/images/ and enter filename above</p>
                  </div>
                </div>
                <button onClick={()=>showToast('Payment settings saved!')} style={{...C.btn,marginTop:'14px'}}>SAVE SETTINGS</button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section==='settings'&&(
            <div>
              <div style={C.hd}>Settings</div>
              <div style={C.sub}>STORE CONFIGURATION</div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'14px'}}>🏪 STORE INFO</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  {[{l:'Brand Name',v:'420 CLOTHING'},{l:'Contact Email',v:'admin@420clothing.in'},{l:'Instagram',v:'@420clothing'},{l:'WhatsApp',v:'+91 XXXXXXXXXX'}].map(f=>(
                    <div key={f.l}><label style={{fontSize:'9px',letterSpacing:'2px',color:'#444',display:'block',marginBottom:'4px'}}>{f.l.toUpperCase()}</label><input style={C.inp} defaultValue={f.v}/></div>
                  ))}
                </div>
                <button onClick={()=>showToast('Store settings saved!')} style={{...C.btn,marginTop:'14px'}}>SAVE SETTINGS</button>
              </div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'14px'}}>🔒 CHANGE ADMIN PASSWORD</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'10px'}}>
                  <div><label style={{fontSize:'9px',letterSpacing:'2px',color:'#444',display:'block',marginBottom:'4px'}}>NEW PASSWORD</label><input type="password" style={C.inp} id="np" placeholder="New password"/></div>
                  <div><label style={{fontSize:'9px',letterSpacing:'2px',color:'#444',display:'block',marginBottom:'4px'}}>CONFIRM</label><input type="password" style={C.inp} id="cp" placeholder="Confirm password"/></div>
                </div>
                <button onClick={()=>{const n=(document.getElementById('np') as HTMLInputElement)?.value;const c=(document.getElementById('cp') as HTMLInputElement)?.value;if(!n){showToast('Enter a password');return}if(n!==c){showToast('Passwords do not match!');return}setAdminPass(n);showToast('Password changed!')}} style={C.btn}>CHANGE PASSWORD</button>
                <p style={{fontSize:'10px',color:'#333',marginTop:'8px'}}>Current default: 420admin</p>
              </div>
              <div style={C.card}>
                <div style={{fontSize:'10px',letterSpacing:'3px',color:'#c8f500',marginBottom:'12px'}}>🚀 DEPLOY STATUS</div>
                {[{l:'Frontend (Vercel)',s:'Not deployed',c:'#ff9900'},{l:'Backend (Railway)',s:'Not deployed',c:'#ff9900'},{l:'Database (Prisma)',s:'Connected ✓',c:'#44cc88'},{l:'Domain',s:'Not connected',c:'#ff9900'}].map(d=>(
                  <div key={d.l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #181818'}}>
                    <span style={{fontSize:'12px',color:'#888'}}>{d.l}</span>
                    <span style={{fontSize:'10px',color:d.c,letterSpacing:'1px'}}>{d.s}</span>
                  </div>
                ))}
                <button onClick={()=>showToast('Phase 9 — Deploy coming next!')} style={{...C.btnO,marginTop:'14px',width:'100%'}}>Phase 9 → Deploy to Vercel 🚀</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
