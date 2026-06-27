import { motion } from 'framer-motion'
import { formatTemp, formatDay } from '@skye/core'
import { WeatherIcon } from './WeatherIcon'
import type { DailyForecast as DailyType } from '@skye/types'

interface Props { daily: DailyType[]; unit: 'C' | 'F' }

export function DailyForecast({ daily, unit }: Props) {
  const allMax = daily.map(d => d.temp_max)
  const allMin = daily.map(d => d.temp_min)
  const gMin = Math.min(...allMin)
  const gMax = Math.max(...allMax)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass" style={{ borderRadius: 16, padding: '14px 16px' }}
    >
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
        7-Day Forecast
      </div>

      {daily.map((d, i) => {
        const minPct = ((d.temp_min - gMin) / (gMax - gMin)) * 100
        const maxPct = ((d.temp_max - gMin) / (gMax - gMin)) * 100

        return (
          <motion.div
            key={d.dt}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.04 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '52px 22px 36px 1fr 32px',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: i < daily.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            {/* Day */}
            <span style={{ color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}>
              {i === 0 ? 'Today' : formatDay(d.dt)}
            </span>

            {/* Icon */}
            <WeatherIcon condition={d.condition.main} size={18} animated={false} />

            {/* Rain % */}
            <span style={{ color: d.pop > 0.2 ? 'rgba(147,197,253,0.8)' : 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'right' }}>
              {d.pop > 0.05 ? `${Math.round(d.pop * 100)}%` : ''}
            </span>

            {/* Temp range bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, width: 28, textAlign: 'right', flexShrink: 0 }}>
                {formatTemp(d.temp_min, unit)}
              </span>
              <div style={{ flex: 1, position: 'relative', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                <motion.div
                  style={{
                    position: 'absolute', top: 0, height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg, #60a5fa, #fbbf24)',
                    left: `${minPct}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${maxPct - minPct}%` }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.55, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Max temp */}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>
              {formatTemp(d.temp_max, unit)}
            </span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
