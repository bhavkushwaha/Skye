import { motion } from 'framer-motion'
import { formatTemp, formatHour } from '@skye/core'
import { WeatherIcon } from './WeatherIcon'
import type { HourlyForecast as HourlyType } from '@skye/types'

interface Props { hourly: HourlyType[]; unit: 'C' | 'F' }

export function HourlyForecast({ hourly, unit }: Props) {
  const hours = hourly.slice(0, 24)
  const temps = hours.map(h => h.temp)
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="glass" style={{ borderRadius: 16, padding: '14px 16px', marginBottom: 12 }}
    >
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
        24-Hour Forecast
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {hours.map((h, i) => {
          const barH = maxT === minT ? 30 : 6 + ((h.temp - minT) / (maxT - minT)) * 44

          return (
            <motion.div
              key={h.dt}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.015 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, minWidth: 44 }}
            >
              {/* Time */}
              <span style={{ color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {i === 0 ? 'Now' : formatHour(h.dt)}
              </span>

              {/* Icon */}
              <WeatherIcon condition={h.condition.main} size={18} animated={false} />

              {/* Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 52, width: '100%', alignItems: 'center' }}>
                <motion.div
                  style={{ width: 4, borderRadius: 3, background: 'linear-gradient(to top, rgba(96,165,250,0.5), rgba(251,191,36,0.8))' }}
                  initial={{ height: 0 }}
                  animate={{ height: barH }}
                  transition={{ delay: i * 0.015 + 0.2, duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              {/* Temp */}
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600 }}>
                {formatTemp(h.temp, unit)}
              </span>

              {/* Rain % */}
              {h.pop > 0.15 ? (
                <span style={{ color: 'rgba(147,197,253,0.8)', fontSize: 9 }}>
                  {Math.round(h.pop * 100)}%
                </span>
              ) : (
                <span style={{ height: 11 }} />
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
