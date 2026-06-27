'use client'
import { useEffect } from 'react'
import { useWeatherStore } from '@skye/shared-hooks'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useWeatherStore.persist.rehydrate()
  }, [])
  return <>{children}</>
}
