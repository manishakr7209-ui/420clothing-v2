import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green:  '#c8f500',
          black:  '#080808',
          dark:   '#0e0e0e',
          surface:'#111111',
          border: '#1e1e1e',
          muted:  '#444444',
          text:   '#e0e0e0',
        },
        accent: {
          orange: '#ff783c',
          blue:   '#64b4ff',
          red:    '#ff4444',
          yellow: '#ff9900',
          green:  '#44cc88',
        }
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
      },
      animation: {
        'slide-in':  'slideIn 0.3s ease',
        'fade-in':   'fadeIn 0.2s ease',
        'slide-up':  'slideUp 0.3s ease',
      },
      keyframes: {
        slideIn:  { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn:   { from: { opacity: '0' },                 to: { opacity: '1' } },
        slideUp:  { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}

export default config
