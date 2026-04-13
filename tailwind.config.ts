import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'pluit-bg': '#0a0e1a',
        'pluit-panel': '#111827',
        'pluit-blue': '#00bfff',
        'pluit-cyan': '#00ffff',
        'pluit-gold': '#ffd700',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}

export default config
