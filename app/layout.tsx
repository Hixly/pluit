import type { Metadata } from 'next'
import { Press_Start_2P, Pixelify_Sans } from 'next/font/google'
import { RainfallCanvas } from '@/components/rain/rainfall-canvas'
import { ServiceWorkerRegister } from '@/components/sw-register'
import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pluit.cloud — Every byte finds a cloud.',
  description: 'AI-powered cloud storage. Upload, search, and chat with your files. Pixel-perfect. Always raining.',
  metadataBase: new URL('https://pluit.cloud'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pluit',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'Pluit.cloud',
    description: 'Every byte finds a cloud.',
    url: 'https://pluit.cloud',
    siteName: 'Pluit.cloud',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pluit.cloud',
    description: 'Every byte finds a cloud.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${pixelifySans.variable}`}>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-pluit-bg text-white min-h-screen">
        <ServiceWorkerRegister />
        <RainfallCanvas opacity={0.2} />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
