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
        'pluit-bg': '#000000',
        'pluit-panel': '#111111',
        'pluit-blue': '#89CFF0',
        'pluit-cyan': '#b8dfff',
        'pluit-gold': '#ffffff',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
}

export default config
