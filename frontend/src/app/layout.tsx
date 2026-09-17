import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '420 CLOTHING — Premium Streetwear For Men',
  description: 'Printed Tees, Joggers, Gym Wear. UPI · COD · QR Payment. Free shipping on orders above ₹799.',
  keywords: ['streetwear', 'men clothing', 'printed tshirts', 'joggers', 'gym wear', 'india'],
  openGraph: {
    title: '420 CLOTHING',
    description: 'Premium Streetwear For Men',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body className="bg-brand-black text-brand-text font-barlow antialiased">
        {children}
      </body>
    </html>
  )
}
