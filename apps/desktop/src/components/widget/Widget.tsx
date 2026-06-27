import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LocateFixed } from 'lucide-react'
import { useWeatherStore, useWeather } from '@skye/shared-hooks'
import { getWeatherTheme, formatTemp, formatHour } from '@skye/core'
import { WeatherBackground } from '@skye/animations'
import { WeatherIcon, AQIOrb } from '@skye/ui'

const SIZES = {
  small:  { w: 280, h: 168 },
  medium: { w: 320, h: 210 },
  large:  { w: 380, h: 268 },
}

export function Widget() {
  useWeather()
  const { weather, isLoading, unit, widgetSize, activeLocation, setActiveLocation } = useWeatherStore()
  const [hovered, setHovered] = useState(false)

  const { w, h } = SIZES[widgetSize]

  function openDashboard() {
    ;(window as any).skye?.openDashboard()
  }
  function closeWidget(e: React.MouseEvent) {
    e.stopPropagation()
    ;(window as any).skye?.closeWidget()
  }

  if (isLoading && !weather) return <WidgetSkeleton w={w} h={h} />
  if (!weather) return <WidgetError w={w} h={h} />

  const { current, hourly, aqi } = weather
  const theme = getWeatherTheme(current.condition.id, current.dt, current.sunrise, current.sunset)

  const hourSlice = hourly.slice(0, widgetSize === 'large' ? 8 : widgetSize === 'medium' ? 6 : 0)
  const temps = hourSlice.map(x => x.temp)
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)
  const maxBar = widgetSize === 'large' ? 36 : 28
  const minBar = 5

  return (
    <motion.div
      className="relative overflow-hidden select-none"
      style={{ width: w, height: h, borderRadius: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <WeatherBackground theme={theme} compact />

      {/* Click-to-open overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ zIndex: 1 }}
        onClick={openDashboard}
      />

      {/* Close button + My Location — always on top */}
      <AnimatePresence>
        {hovered && activeLocation && (
          <motion.button
            className="absolute no-drag"
            style={{ top: 10, left: 10, zIndex: 10, background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.5)', borderRadius: 20, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#a5b4fc', fontSize: 10, fontWeight: 700 }}
            onClick={(e) => { e.stopPropagation(); setActiveLocation(null) }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
          >
            <LocateFixed size={9} />
            My Location
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hovered && (
          <motion.button
            className="absolute no-drag"
            style={{ top: 10, right: 10, zIndex: 10, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}
            onClick={closeWidget}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            whileHover={{ background: 'rgba(239,68,68,0.7)', color: 'white' }}
          >
            <X size={11} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col" style={{ padding: '16px 18px 14px', zIndex: 2, pointerEvents: 'none' }}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
              📍 {current.city}
            </div>
            <div className="temp-glow" style={{ color: 'white', fontWeight: 700, fontSize: widgetSize === 'large' ? 60 : widgetSize === 'small' ? 42 : 52, lineHeight: 1, letterSpacing: '-2px' }}>
              {formatTemp(current.temp, unit)}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2, fontWeight: 400 }}>
              {current.condition.description} · H:{formatTemp(current.temp_max, unit)} L:{formatTemp(current.temp_min, unit)}
            </div>
          </div>

          <div className="flex flex-col items-end" style={{ gap: 8, paddingTop: 2 }}>
            <WeatherIcon condition={current.condition.main} size={widgetSize === 'large' ? 46 : 38} />
            <AQIOrb aqi={aqi.aqi} label={aqi.label} size="sm" />
          </div>
        </div>

        {/* Hourly bars */}
        {widgetSize !== 'small' && hourSlice.length > 0 && (
          <div className="flex items-end" style={{ gap: 4, marginTop: 'auto' }}>
            {hourSlice.map((h, i) => {
              const barH = maxT === minT ? (maxBar + minBar) / 2
                : minBar + ((h.temp - minT) / (maxT - minT)) * (maxBar - minBar)
              return (
                <div key={i} className="flex flex-col items-center" style={{ flex: 1, gap: 3 }}>
                  <motion.div
                    style={{ width: '100%', height: barH, borderRadius: 4, background: 'linear-gradient(to top, rgba(255,255,255,0.12), rgba(255,255,255,0.32))' }}
                    initial={{ scaleY: 0, originY: '100%' }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.45, ease: 'easeOut' }}
                  />
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                    {formatHour(h.dt).replace(' ', '')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 40, background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)', borderBottomLeftRadius: 22, borderBottomRightRadius: 22, pointerEvents: 'none', zIndex: 3 }} />
    </motion.div>
  )
}

function WidgetSkeleton({ w, h }: { w: number; h: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 22, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: 16 }}>
      <div style={{ width: 80, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', marginBottom: 8 }} />
      <div style={{ width: 100, height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: 6 }} />
      <div style={{ width: 120, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

function WidgetError({ w, h }: { w: number; h: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 22, background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <span style={{ fontSize: 28 }}>⚠️</span>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Location unavailable</p>
    </div>
  )
}
