import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-border px-6 py-5 flex flex-wrap items-center justify-between gap-4">
      <div className="font-bebas text-lg tracking-[4px] text-brand-muted">420 CLOTHING</div>
      <div className="flex gap-5">
        {['About', 'Size Guide', 'Returns', 'Contact'].map((l) => (
          <span key={l} className="text-[11px] text-brand-muted tracking-[2px] cursor-pointer hover:text-brand-green transition-colors">{l}</span>
        ))}
      </div>
      <div className="flex gap-2">
        <a href="#" className="w-7 h-7 border border-brand-border rounded-md flex items-center justify-center text-brand-muted text-sm hover:border-brand-green hover:text-brand-green transition-all">
          <i className="ti ti-brand-instagram" />
        </a>
        <a href="#" className="w-7 h-7 border border-brand-border rounded-md flex items-center justify-center text-brand-muted text-sm hover:border-brand-green hover:text-brand-green transition-all">
          <i className="ti ti-brand-whatsapp" />
        </a>
      </div>
    </footer>
  )
}
