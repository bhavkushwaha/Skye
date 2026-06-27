import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { WeatherTheme, AQIData } from '@/types/weather'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeatherTheme(conditionId: number, dt: number, sunrise: number, sunset: number): WeatherTheme {
  const isNight = dt < sunrise || dt > sunset

  if (conditionId >= 200 && conditionId < 300) return 'stormy'
  if (conditionId >= 300 && conditionId < 600) return 'rainy'
  if (conditionId >= 600 && conditionId < 700) return 'snowy'
  if (conditionId >= 700 && conditionId < 800) return 'foggy'
  if (conditionId === 800) return isNight ? 'clear-night' : 'clear-day'
  if (conditionId === 801 || conditionId === 802) return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day'
  return 'cloudy'
}

export function getAQIData(aqi: number): AQIData['label'] {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#eab308'
  if (aqi <= 150) return '#f97316'
  if (aqi <= 200) return '#ef4444'
  if (aqi <= 300) return '#a855f7'
  return '#7f1d1d'
}

export function formatTemp(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') return `${Math.round((temp * 9) / 5 + 32)}°`
  return `${Math.round(temp)}°`
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDay(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' })
}

export function formatHour(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export function getSmartSummary(weather: { temp: number; condition: string; aqi: number; pop: number }): string {
  const { temp, condition, aqi, pop } = weather

  if (pop > 0.7) return `Rain likely soon. Grab an umbrella before heading out.`
  if (aqi > 150) return `Air quality is poor today. Consider staying indoors.`
  if (aqi > 100) return `Moderate air quality. Sensitive groups should limit outdoor time.`
  if (condition.toLowerCase().includes('clear') && temp > 25) return `Beautiful sunny day. Great for outdoor activities.`
  if (condition.toLowerCase().includes('snow')) return `Snow expected. Dress warm and drive carefully.`
  if (condition.toLowerCase().includes('storm')) return `Thunderstorms possible. Stay safe and indoors.`
  if (temp < 5) return `Very cold today. Bundle up well before going out.`
  if (aqi <= 50 && temp >= 18 && temp <= 28) return `Perfect conditions outside. Enjoy your day!`
  return `Conditions are ${condition.toLowerCase()}. Have a great day!`
}
