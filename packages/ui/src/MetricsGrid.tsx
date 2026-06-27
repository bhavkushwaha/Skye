import { motion } from 'framer-motion'
import { getWindDirection } from '@skye/core'
import type { CurrentWeather } from '@skye/types'

interface Props { current: CurrentWeather; unit?: 'C' | 'F' }

export function MetricsGrid({ current }: Props) {
  const metrics = [
    {
      icon: '💧', label: 'Humidity', value: `${current.humidity}%`,
      sub: current.humidity > 70 ? 'High' : current.humidity > 40 ? 'Comfortable' : 'Low',
      bar: current.humidity,
    },
    {
      icon: '💨', label: 'Wind', value: `${Math.round(current.wind_speed)} km/h`,
      sub: getWindDirection(current.wind_deg),
      bar: Math.min(current.wind_speed / 100 * 100, 100),
    },
    {
      icon: '🔆', label: 'UV Index', value: `${current.uv_index.toFixed(0)}`,
      sub: current.uv_index <= 2 ? 'Low' : current.uv_index <= 5 ? 'Moderate' : current.uv_index <= 7 ? 'High' : 'Very High',
      bar: Math.min(current.uv_index / 11 * 100, 100),
    },
    {
      icon: '🌡️', label: 'Pressure', value: `${Math.round(current.pressure)} hPa`,
      sub: current.pressure < 1000 ? 'Low' : current.pressure > 1020 ? 'High' : 'Normal',
      bar: ((current.pressure - 960) / 80) * 100,
    },
    {
      icon: '👁️', label: 'Visibility', value: `${current.visibility.toFixed(0)} km`,
      sub: current.visibility > 8 ? 'Excellent' : current.visibility > 4 ? 'Good' : 'Poor',
      bar: Math.min(current.visibility / 10 * 100, 100),
    },
    {
      icon: '🌡', label: 'Feels Like', value: `${Math.round(current.feels_like)}°`,
      sub: current.feels_like > current.temp ? 'Warmer' : current.feels_like < current.temp ? 'Cooler' : 'Same',
      bar: 65,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.04 }}
          className="glass card-tilt"
          style={{ borderRadius: 14, padding: '14px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>{m.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.label}</span>
          </div>
          <div style={{ color: 'white', fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: 3 }}>{m.value}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 8 }}>{m.sub}</div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <motion.div
              style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6))' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, m.bar))}%` }}
              transition={{ delay: 0.2 + i * 0.04, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
