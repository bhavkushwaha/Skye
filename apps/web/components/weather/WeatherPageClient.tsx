'use client'
import dynamic from 'next/dynamic'
import { StoreProvider } from './StoreProvider'

const WebDashboard = dynamic(
  () => import('./WebDashboard').then(m => m.WebDashboard),
  { ssr: false }
)

export function WeatherPageClient() {
  return (
    <StoreProvider>
      <WebDashboard />
    </StoreProvider>
  )
}
