import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw } from 'lucide-react'
import { useWeatherStore, useWeather } from '@skye/shared-hooks'
import { getWeatherTheme, formatTemp, getSmartSummary, formatTime } from '@skye/core'
import { WeatherBackground } from '@skye/animations'
import { WeatherIcon, AQIOrb, MetricsGrid, HourlyForecast, DailyForecast, LocationSearch } from '@skye/ui'

export function Dashboard() {
  const { refresh } = useWeather()
  const { weather, isLoading, unit, setUnit } = useWeatherStore()
  const [showSearch, setShowSearch] = useState(false)

  const theme = weather
    ? getWeatherTheme(weather.current.condition.id, weather.current.dt, weather.current.sunrise, weather.current.sunset)
    : 'clear-day'

  const c = weather?.current
  const aqi = weather?.aqi

  const pop = weather ? Math.max(...weather.hourly.slice(0, 4).map(h => h.pop)) : 0
  const summary = c && aqi ? getSmartSummary({ temp: c.temp, condition: c.condition.main, aqi: aqi.aqi, pop }) : ''

  function close()    { (window as any).skye?.closeDashboard() }
  function minimize() { (window as any).skye?.minimizeDashboard() }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', borderRadius: 14, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Live background */}
      <WeatherBackground theme={theme} />

      {/* Dark scrim for readability */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(0px)' }} />

      {/* ── Title bar ───────────────────────────────── */}
      <div className="drag absolute top-0 left-0 right-0 flex items-center justify-between"
        style={{ height: 48, padding: '0 16px', zIndex: 40 }}>

        {/* Traffic lights */}
        <div className="no-drag flex items-center" style={{ gap: 8 }}>
          <button onClick={close}    style={dot('#ef4444')} title="Close"    onMouseEnter={e => dotHover(e, true)}  onMouseLeave={e => dotHover(e, false)} />
          <button onClick={minimize} style={dot('#f59e0b')} title="Minimize" onMouseEnter={e => dotHover(e, true)}  onMouseLeave={e => dotHover(e, false)} />
          <div                       style={dot('#22c55e', false)} />
        </div>

        {/* App name */}
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', pointerEvents: 'none' }}>
          Skye
        </span>

        {/* Controls */}
        <div className="no-drag flex items-center" style={{ gap: 6 }}>
          {/* °C / °F toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
            {(['C','F'] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 16, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  background: unit === u ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: unit === u ? 'white' : 'rgba(255,255,255,0.4)' }}>
                °{u}
              </button>
            ))}
          </div>

          <IconBtn onClick={() => setShowSearch(true)} title="Search location"><Search size={13} /></IconBtn>
          <IconBtn onClick={refresh} title="Refresh" spin={isLoading}><RefreshCw size={13} /></IconBtn>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-y-auto no-drag" style={{ paddingTop: 48 }}>
        <div style={{ padding: '12px 20px 24px', minHeight: '100%' }}>

          {/* Smart summary */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="glass" style={{ borderRadius: 12, padding: '10px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: 500 }}>{summary}</span>
            </motion.div>
          )}

          {c && aqi ? (
            <>
              {/* ── Row 1: Current + AQI ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 12, marginBottom: 12 }}>

                {/* Current weather card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="glass card-tilt" style={{ borderRadius: 16, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      {/* Location */}
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                        📍 {c.city}{c.country ? `, ${c.country}` : ''}
                      </div>

                      {/* Temperature */}
                      <div className="temp-glow" style={{ fontSize: 80, fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-3px', marginBottom: 6 }}>
                        {formatTemp(c.temp, unit)}
                      </div>

                      {/* Condition */}
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 500, marginBottom: 8, textTransform: 'capitalize' }}>
                        {c.condition.description}
                      </div>

                      {/* High/Low/Feels */}
                      <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                        <span>H: <b style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTemp(c.temp_max, unit)}</b></span>
                        <span>L: <b style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTemp(c.temp_min, unit)}</b></span>
                        <span>Feels <b style={{ color: 'rgba(255,255,255,0.7)' }}>{formatTemp(c.feels_like, unit)}</b></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0 }}>
                      <WeatherIcon condition={c.condition.main} size={80} />
                    </div>
                  </div>

                  {/* Sunrise / Sunset */}
                  <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>🌅</span>
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sunrise</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>{formatTime(c.sunrise)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>🌇</span>
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sunset</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>{formatTime(c.sunset)}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AQI card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="glass card-tilt" style={{ borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                    Air Quality
                  </div>

                  <AQIOrb aqi={aqi.aqi} label={aqi.label} size="lg" />

                  {/* Pollutant bars */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                    {[
                      { key: 'pm2_5' as const, label: 'PM2.5', max: 75 },
                      { key: 'pm10'  as const, label: 'PM10',  max: 200 },
                      { key: 'o3'    as const, label: 'O₃',    max: 240 },
                      { key: 'no2'   as const, label: 'NO₂',   max: 200 },
                    ].map((p, i) => {
                      const val = aqi.components[p.key]
                      const pct = Math.min((val / p.max) * 100, 100)
                      return (
                        <div key={p.key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10 }}>{p.label}</span>
                            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 600 }}>{val.toFixed(1)}</span>
                          </div>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                            <motion.div
                              style={{ height: '100%', borderRadius: 2, background: aqi.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              {/* ── Row 2: Metrics ── */}
              <MetricsGrid current={c} unit={unit} />

              {/* ── Row 3: 24h Forecast ── */}
              <HourlyForecast hourly={weather!.hourly} unit={unit} />

              {/* ── Row 4: 7-day ── */}
              <DailyForecast daily={weather!.daily} unit={unit} />
            </>
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </div>

      {/* Location search overlay */}
      <AnimatePresence>
        {showSearch && <LocationSearch onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </div>
  )
}

/* ─── Helpers ─────────────────────────────────────── */

function dot(color: string, interactive = true) {
  return {
    width: 13, height: 13, borderRadius: '50%', background: color,
    border: 'none', cursor: interactive ? 'pointer' : 'default',
    opacity: interactive ? 1 : 0.35,
    transition: 'opacity 0.15s, filter 0.15s',
    flexShrink: 0,
  } as React.CSSProperties
}
function dotHover(e: React.MouseEvent, enter: boolean) {
  const el = e.currentTarget as HTMLElement
  el.style.filter = enter ? 'brightness(1.2)' : 'none'
}

function IconBtn({ children, onClick, title, spin }: { children: React.ReactNode; onClick?: () => void; title?: string; spin?: boolean }) {
  return (
    <motion.button
      onClick={onClick} title={title}
      style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
      {[180, 100, 80, 120].map((h, i) => (
        <div key={i} className="glass" style={{ borderRadius: 16, height: h, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  )
}
