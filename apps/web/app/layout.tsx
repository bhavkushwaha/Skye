import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Skye — Weather, beautifully reimagined',
  description: 'Premium weather app with real-time AQI, hourly & daily forecasts, and cinematic weather backgrounds. Free. No account required. Installs on any device.',
  keywords: ['weather', 'forecast', 'AQI', 'air quality', 'PWA', 'weather app'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Skye',
  },
  icons: {
    icon: '/icons/icon-512.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Skye — Weather, beautifully reimagined',
    description: 'Premium weather app. Live data, cinematic backgrounds, real-time AQI.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#050810',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
