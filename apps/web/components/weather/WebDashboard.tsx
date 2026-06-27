'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, MapPin, LocateFixed } from 'lucide-react'
import Link from 'next/link'
import { useWeatherStore, useWeather } from '@skye/shared-hooks'
import { getWeatherTheme, formatTemp, getSmartSummary, formatTime } from '@skye/core'
import { WeatherBackground } from '@skye/animations'
import { WeatherIcon, AQIOrb, MetricsGrid, HourlyForecast, DailyForecast, LocationSearch } from '@skye/ui'
import { InstallPrompt } from './InstallPrompt'

export function WebDashboard() {
  const { refresh } = useWeather()
  const { weather, isLoading, unit, setUnit, activeLocation, setActiveLocation } = useWeatherStore()
  const [showSearch, setShowSearch] = useState(false)

  const theme = weather
    ? getWeatherTheme(weather.current.condition.id, weather.current.dt, weather.current.sunrise, weather.current.sunset)
    : 'clear-day'

  const c = weather?.current
  const aqi = weather?.aqi
  const pop = weather ? Math.max(...weather.hourly.slice(0, 4).map(h => h.pop)) : 0
  const summary = c && aqi ? getSmartSummary({ temp: c.temp, condition: c.condition.main, aqi: aqi.aqi, pop }) : ''

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* Animated weather background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <WeatherBackground theme={theme} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.40)' }} />
      </div>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 56,
        background: 'rgba(5,8,16,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Skye</span>
          {c && (
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
              <MapPin size={10} />
              {c.city}{c.country ? `, ${c.country}` : ''}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Unit toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
            {(['C', 'F'] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)} style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 16,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: unit === u ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: unit === u ? 'white' : 'rgba(255,255,255,0.35)',
              }}>°{u}</button>
            ))}
          </div>
          {activeLocation && (
            <motion.button
              onClick={() => setActiveLocation(null)}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.4)',
                color: '#a5b4fc', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}
              whileHover={{ background: 'rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.94 }}
            >
              <LocateFixed size={11} />
              My Location
            </motion.button>
          )}
          <HeaderBtn onClick={() => setShowSearch(true)}><Search size={14} /></HeaderBtn>
          <HeaderBtn onClick={refresh} spin={isLoading}><RefreshCw size={14} /></HeaderBtn>
        </div>
      </header>

      {/* Scrollable content */}
      <main style={{ position: 'relative', zIndex: 10, padding: '20px 16px 120px', maxWidth: 860, margin: '0 auto' }}>

        {/* Smart summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="glass" style={{ borderRadius: 14, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>{summary}</span>
          </motion.div>
        )}

        {c && aqi ? (
          <>
            {/* Hero weather block */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="glass" style={{ borderRadius: 20, padding: '24px', marginBottom: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                {/* Temp + condition */}
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    📍 {c.city}{c.country ? `, ${c.country}` : ''}
                  </div>
                  <div className="temp-glow" style={{ fontSize: 'clamp(64px, 15vw, 96px)', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-3px' }}>
                    {formatTemp(c.temp, unit)}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, fontWeight: 500, margin: '6px 0 12px', textTransform: 'capitalize' }}>
                    {c.condition.description}
                  </div>
                  <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    <span>H: <b style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTemp(c.temp_max, unit)}</b></span>
                    <span>L: <b style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTemp(c.temp_min, unit)}</b></span>
                    <span>Feels <b style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTemp(c.feels_like, unit)}</b></span>
                  </div>
                </div>

                {/* Icon + AQI */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <WeatherIcon condition={c.condition.main} size={80} />
                  <AQIOrb aqi={aqi.aqi} label={aqi.label} size="md" />
                </div>
              </div>

              {/* Sunrise / Sunset */}
              <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { emoji: '🌅', label: 'Sunrise', val: formatTime(c.sunrise) },
                  { emoji: '🌇', label: 'Sunset',  val: formatTime(c.sunset) },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{row.emoji}</span>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{row.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>{row.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AQI detail (mobile: full width card) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="glass" style={{ borderRadius: 20, padding: '18px 20px', marginBottom: 12 }}
            >
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Air Quality</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <AQIOrb aqi={aqi.aqi} label={aqi.label} size="lg" />
                <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {([
                    { key: 'pm2_5' as const, label: 'PM2.5', max: 75 },
                    { key: 'pm10'  as const, label: 'PM10',  max: 200 },
                    { key: 'o3'    as const, label: 'O₃',    max: 240 },
                    { key: 'no2'   as const, label: 'NO₂',   max: 200 },
                  ]).map((p, i) => {
                    const val = aqi.components[p.key]
                    const pct = Math.min((val / p.max) * 100, 100)
                    return (
                      <div key={p.key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>{p.label}</span>
                          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600 }}>{val.toFixed(1)}</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div
                            style={{ height: '100%', borderRadius: 2, background: aqi.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Metrics */}
            <MetricsGrid current={c} unit={unit} />

            {/* Hourly */}
            <HourlyForecast hourly={weather!.hourly} unit={unit} />

            {/* Daily */}
            <DailyForecast daily={weather!.daily} unit={unit} />
          </>
        ) : (
          <LoadingSkeleton />
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>
            © 2026 Skye Weather — a product of{' '}
            <a href="https://bhavkushwaha.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
              bhavkushwaha.com
            </a>
          </span>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, textDecoration: 'none' }}>About Skye</Link>
        </div>
      </main>

      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && <LocationSearch onClose={() => setShowSearch(false)} />}
      </AnimatePresence>

      {/* PWA install banner */}
      <InstallPrompt />
    </div>
  )
}

function HeaderBtn({ children, onClick, spin }: { children: React.ReactNode; onClick?: () => void; spin?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      whileHover={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
      whileTap={{ scale: 0.92 }}
      animate={spin ? { rotate: 360 } : { rotate: 0 }}
      transition={spin ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
    >
      {children}
    </motion.button>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[200, 120, 100, 140].map((h, i) => (
        <div key={i} className="glass" style={{ borderRadius: 20, height: h, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  )
}
