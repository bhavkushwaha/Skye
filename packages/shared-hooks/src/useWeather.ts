import { useEffect, useCallback } from 'react'
import { useWeatherStore } from './weatherStore'
import { fetchWeather, getCurrentPosition } from '@skye/weather-sdk'

export function useWeather() {
  const { setWeather, setLoading, setError, activeLocation } = useWeatherStore()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let lat: number, lon: number

      if (activeLocation) {
        lat = activeLocation.coords.lat
        lon = activeLocation.coords.lon
      } else {
        const pos = await getCurrentPosition()
        lat = pos.lat
        lon = pos.lon
      }

      const data = await fetchWeather(lat, lon)
      setWeather(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load weather'
      setError(message)
      // Fallback to mock data for development
      setWeather(getMockWeather())
    } finally {
      setLoading(false)
    }
  }, [activeLocation, setWeather, setLoading, setError])

  useEffect(() => {
    load()
    const interval = setInterval(load, 10 * 60 * 1000) // refresh every 10 min
    return () => clearInterval(interval)
  }, [load])

  return { refresh: load }
}

function getMockWeather() {
  return {
    current: {
      temp: 22,
      feels_like: 20,
      temp_min: 16,
      temp_max: 26,
      humidity: 58,
      pressure: 1013,
      visibility: 10,
      uv_index: 6,
      wind_speed: 14,
      wind_deg: 220,
      sunrise: Math.floor(Date.now() / 1000) - 3600 * 5,
      sunset: Math.floor(Date.now() / 1000) + 3600 * 5,
      condition: { id: 800, main: 'Clear', description: 'Clear sky', icon: '01d' },
      city: 'London',
      country: 'GB',
      coords: { lat: 51.5, lon: -0.12 },
      dt: Math.floor(Date.now() / 1000),
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      dt: Math.floor(Date.now() / 1000) + i * 3600,
      temp: 18 + Math.sin(i / 4) * 6,
      feels_like: 16 + Math.sin(i / 4) * 5,
      humidity: 55 + Math.random() * 20,
      wind_speed: 10 + Math.random() * 10,
      condition: { id: 800, main: 'Clear', description: 'Clear sky', icon: '01d' },
      pop: Math.random() * 0.3,
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
      dt: Math.floor(Date.now() / 1000) + i * 86400,
      temp_min: 14 + Math.random() * 4,
      temp_max: 24 + Math.random() * 6,
      humidity: 55 + Math.random() * 20,
      wind_speed: 10 + Math.random() * 10,
      condition: { id: 800 + i * 10, main: i < 2 ? 'Clear' : i < 4 ? 'Clouds' : 'Rain', description: 'Sky', icon: '01d' },
      pop: Math.random() * 0.5,
      uv_index: 4 + Math.random() * 4,
    })),
    aqi: {
      aqi: 42,
      label: 'Good',
      color: '#22c55e',
      components: { co: 230, no2: 15, o3: 68, pm2_5: 8, pm10: 14, so2: 4 },
    },
  }
}
