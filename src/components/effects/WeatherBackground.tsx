import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WeatherTheme } from '@/types/weather'

interface Props {
  theme: WeatherTheme
  compact?: boolean
}

const BG: Record<WeatherTheme, string> = {
  'clear-day':           'linear-gradient(135deg, #f59e0b 0%, #ef6c00 35%, #1565c0 100%)',
  'clear-night':         'linear-gradient(135deg, #0a0f1e 0%, #1a237e 50%, #0d1526 100%)',
  'partly-cloudy-day':   'linear-gradient(135deg, #2196f3 0%, #78909c 60%, #455a64 100%)',
  'partly-cloudy-night': 'linear-gradient(135deg, #0d1526 0%, #1a237e 50%, #263238 100%)',
  'cloudy':              'linear-gradient(135deg, #37474f 0%, #546e7a 60%, #607d8b 100%)',
  'rainy':               'linear-gradient(135deg, #1c2b3a 0%, #2c3e50 50%, #3d5a73 100%)',
  'stormy':              'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
  'snowy':               'linear-gradient(135deg, #cfd8dc 0%, #eceff1 50%, #b0bec5 100%)',
  'foggy':               'linear-gradient(135deg, #78909c 0%, #90a4ae 50%, #b0bec5 100%)',
}

export function WeatherBackground({ theme, compact = false }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        key={theme}
        className="absolute inset-0"
        style={{ background: BG[theme] }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      {/* Depth vignette */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />

      <AnimatePresence mode="wait">
        {theme === 'clear-day'           && <SunParticles key="sun"   compact={compact} />}
        {theme === 'clear-night'         && <Stars        key="stars" compact={compact} />}
        {(theme === 'partly-cloudy-night') && <Stars      key="pcn"   compact={compact} dim />}
        {(theme === 'rainy')             && <Rain         key="rain"  compact={compact} />}
        {theme === 'stormy'              && <Storm        key="storm" compact={compact} />}
        {theme === 'snowy'               && <Snow         key="snow"  compact={compact} />}
        {theme === 'foggy'               && <Fog          key="fog" />}
        {(theme === 'cloudy' || theme === 'partly-cloudy-day') && <Clouds key="clouds" compact={compact} />}
      </AnimatePresence>
    </div>
  )
}

/* ─── Effect layers ─────────────────────────────── */

function SunParticles({ compact }: { compact: boolean }) {
  const dots = useMemo(() => Array.from({ length: compact ? 8 : 28 }, (_, i) => ({
    id: i, x: Math.random() * 100, size: 1.5 + Math.random() * 3,
    delay: Math.random() * 10, dur: 7 + Math.random() * 8,
  })), [compact])

  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute" style={{
        top: compact ? '10%' : '8%', left: compact ? '60%' : '30%',
        width: compact ? 60 : 120, height: compact ? 60 : 120,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,220,50,0.08) 50%, transparent 70%)',
        filter: 'blur(8px)',
      }} />
      {dots.map(d => (
        <div key={d.id} className="absolute rounded-full"
          style={{
            left: `${d.x}%`, bottom: -10,
            width: d.size, height: d.size,
            background: 'rgba(255,255,255,0.55)',
            animation: `float-dust ${d.dur}s ${d.delay}s ease-in-out infinite`,
          }} />
      ))}
    </motion.div>
  )
}

function Stars({ compact, dim }: { compact: boolean; dim?: boolean }) {
  const stars = useMemo(() => Array.from({ length: compact ? 25 : 90 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 75,
    size: 0.5 + Math.random() * 1.8, delay: Math.random() * 6, dur: 2 + Math.random() * 4,
  })), [compact])

  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: 'white',
            opacity: dim ? 0.4 : 1,
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }} />
      ))}
      {/* Moon glow */}
      <div className="absolute" style={{ top: '8%', right: '15%', width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,220,255,0.07)', filter: 'blur(12px)' }} />
    </motion.div>
  )
}

function Rain({ compact }: { compact: boolean }) {
  const drops = useMemo(() => Array.from({ length: compact ? 20 : 55 }, (_, i) => ({
    id: i, x: Math.random() * 100, h: 14 + Math.random() * 18,
    delay: Math.random() * 2, dur: 0.55 + Math.random() * 0.35, opacity: 0.25 + Math.random() * 0.35,
  })), [compact])

  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {drops.map(d => (
        <div key={d.id} className="absolute"
          style={{
            left: `${d.x}%`, top: -20, width: 1, height: d.h,
            background: 'linear-gradient(to bottom, transparent, rgba(180,210,255,0.7))',
            opacity: d.opacity,
            animation: `rain-fall ${d.dur}s ${d.delay}s linear infinite`,
          }} />
      ))}
    </motion.div>
  )
}

function Storm({ compact }: { compact: boolean }) {
  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Rain compact={compact} />
      <div className="absolute inset-0 bg-white" style={{ animation: 'lightning-flash 7s ease-in-out infinite', pointerEvents: 'none' }} />
    </motion.div>
  )
}

function Snow({ compact }: { compact: boolean }) {
  const flakes = useMemo(() => Array.from({ length: compact ? 18 : 55 }, (_, i) => ({
    id: i, x: Math.random() * 100, size: 2.5 + Math.random() * 4,
    delay: Math.random() * 9, dur: 7 + Math.random() * 8, opacity: 0.5 + Math.random() * 0.5,
  })), [compact])

  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {flakes.map(f => (
        <div key={f.id} className="absolute rounded-full bg-white"
          style={{
            left: `${f.x}%`, top: -10,
            width: f.size, height: f.size, opacity: f.opacity,
            animation: `snow-drift ${f.dur}s ${f.delay}s linear infinite`,
          }} />
      ))}
    </motion.div>
  )
}

function Fog() {
  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute inset-0"
          style={{ background: `rgba(255,255,255,${0.04 + i * 0.02})`, backdropFilter: 'blur(2px)' }}
          animate={{ x: ['-8%', '8%', '-8%'] }}
          transition={{ duration: 8 + i * 3, ease: 'easeInOut', repeat: Infinity, delay: i * 2 }} />
      ))}
    </motion.div>
  )
}

function Clouds({ compact }: { compact: boolean }) {
  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {[
        { top: '10%', left: '5%', w: 160, h: 50, delay: 0, dur: 9 },
        { top: '20%', right: '8%', w: 200, h: 60, delay: 1, dur: 12 },
        ...(compact ? [] : [
          { top: '5%', left: '40%', w: 120, h: 40, delay: 0.5, dur: 10 },
        ]),
      ].map((c, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            ...c as any,
            background: 'rgba(255,255,255,0.12)',
            filter: 'blur(20px)',
          }}
          animate={{ x: ['-4%', '4%', '-4%'] }}
          transition={{ duration: c.dur, ease: 'easeInOut', repeat: Infinity, delay: c.delay }} />
      ))}
    </motion.div>
  )
}
