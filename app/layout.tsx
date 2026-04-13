import type { Metadata } from 'next'
import { Press_Start_2P, Inter } from 'next/font/google'
import { RainfallCanvas } from '@/components/rain/rainfall-canvas'
import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pluit.cloud — Every byte finds a cloud.',
  description: 'AI-enhanced cloud storage with a pixel rain aesthetic.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${inter.variable}`}>
      <body className="bg-pluit-bg text-white min-h-screen">
        <RainfallCanvas opacity={0.2} />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
