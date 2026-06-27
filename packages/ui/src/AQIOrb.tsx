import { motion } from 'framer-motion'
import { getAQIColor } from '@skye/core'

interface Props { aqi: number; label: string; size?: 'sm' | 'md' | 'lg' }

const PX = { sm: 34, md: 52, lg: 76 }

export function AQIOrb({ aqi, label, size = 'md' }: Props) {
  const color = getAQIColor(aqi)
  const px = PX[size]
  const ring = Math.min(aqi / 300, 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <motion.div
        className="orb-animate"
        style={{
          width: px, height: px, borderRadius: '50%', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle at 35% 35%, ${color}30, ${color}10)`,
          border: `1.5px solid ${color}50`,
          boxShadow: `0 0 ${px * 0.45}px ${color}45, 0 0 ${px}px ${color}18`,
        }}
        animate={{
          boxShadow: [
            `0 0 ${px * 0.45}px ${color}45, 0 0 ${px}px ${color}18`,
            `0 0 ${px * 0.65}px ${color}65, 0 0 ${px * 1.3}px ${color}28`,
            `0 0 ${px * 0.45}px ${color}45, 0 0 ${px}px ${color}18`,
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Ring */}
        <svg style={{ position: 'absolute', top: -2, left: -2, width: px + 4, height: px + 4, transform: 'rotate(-90deg)' }}>
          <circle cx={(px + 4) / 2} cy={(px + 4) / 2} r={(px - 6) / 2}
            fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.25} />
          <motion.circle
            cx={(px + 4) / 2} cy={(px + 4) / 2} r={(px - 6) / 2}
            fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={Math.PI * (px - 6)}
            initial={{ strokeDashoffset: Math.PI * (px - 6) }}
            animate={{ strokeDashoffset: Math.PI * (px - 6) * (1 - ring) }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>

        <span style={{ fontSize: px * 0.26, fontWeight: 800, color, position: 'relative', letterSpacing: '-0.5px' }}>{aqi}</span>
      </motion.div>

      {size !== 'sm' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AQI</div>
          <div style={{ color, fontSize: 11, fontWeight: 700 }}>{label}</div>
        </div>
      )}
    </div>
  )
}
