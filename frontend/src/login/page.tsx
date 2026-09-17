'use client'
import { useState } from 'react'
import Link from 'next/link'
import { loginUser, registerUser } from '@/lib/api'

export default function LoginPage() {
  const [tab, setTab] = useState<'login'|'register'>('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await loginUser(fd.get('email') as string, fd.get('password') as string)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      window.location.href = '/'
    } catch (err: any) {
      setMsg(err.message)
    } finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await registerUser({
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        password: fd.get('password') as string,
      })
      localStorage.setItem('token', res.token)
      window.location.href = '/'
    } catch (err: any) {
      setMsg(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-bebas text-4xl tracking-[6px] text-brand-green">420</span>
            <span className="font-barlow text-sm tracking-[4px] text-brand-muted ml-2">CLOTHING</span>
          </Link>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-brand-border">
            {(['login','register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setMsg('') }}
                className={`flex-1 py-3 text-[11px] tracking-[2px] font-semibold transition-colors ${tab === t ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-dark text-brand-muted'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="p-5">
            {msg && <p className="text-red-400 text-xs tracking-[1px] mb-3 text-center">{msg}</p>}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input name="email" type="email" placeholder="Email address" required className="bg-brand-dark border border-brand-border rounded-md px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green transition-colors" />
                <input name="password" type="password" placeholder="Password" required className="bg-brand-dark border border-brand-border rounded-md px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green transition-colors" />
                <button type="submit" disabled={loading} className="bg-brand-green text-black font-bebas text-lg tracking-[3px] py-2.5 rounded-md hover:bg-[#d4ff10] transition-colors disabled:opacity-50">
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
                <div className="text-center text-[11px] text-brand-muted tracking-[2px]">— OR —</div>
                <button type="button" className="bg-brand-dark text-brand-green border border-brand-green/30 font-bebas text-base tracking-[2px] py-2.5 rounded-md hover:bg-brand-green/10 transition-colors">
                  CONTINUE WITH GOOGLE
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <input name="name" placeholder="Full Name" required className="bg-brand-dark border border-brand-border rounded-md px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green transition-colors" />
                <input name="phone" type="tel" placeholder="Phone Number" className="bg-brand-dark border border-brand-border rounded-md px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green transition-colors" />
                <input name="email" type="email" placeholder="Email Address" required className="bg-brand-dark border border-brand-border rounded-md px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green transition-colors" />
                <input name="password" type="password" placeholder="Create Password" required className="bg-brand-dark border border-brand-border rounded-md px-3 py-2.5 text-sm text-brand-text outline-none focus:border-brand-green transition-colors" />
                <button type="submit" disabled={loading} className="bg-brand-green text-black font-bebas text-lg tracking-[3px] py-2.5 rounded-md hover:bg-[#d4ff10] transition-colors disabled:opacity-50">
                  {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-brand-muted text-xs mt-4 tracking-[1px]">
          <Link href="/" className="hover:text-brand-green transition-colors">← Back to Store</Link>
        </p>
      </div>
    </div>
  )
}
