import { motion, type Transition } from 'framer-motion'

interface Props {
  condition: string
  size?: number
  animated?: boolean
  className?: string
}

export function WeatherIcon({ condition, size = 48, animated = true, className }: Props) {
  const main = condition.toLowerCase()
  const icon = getIcon(main)

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={animated ? icon.animation : undefined}
      transition={icon.transition as Transition}
    >
      <span style={{ fontSize: size, lineHeight: 1, display: 'block', textAlign: 'center' }}>
        {icon.emoji}
      </span>
    </motion.div>
  )
}

function getIcon(condition: string) {
  if (condition.includes('thunder') || condition.includes('storm')) {
    return {
      emoji: '⛈️',
      animation: { rotate: [0, -3, 3, -3, 0], scale: [1, 1.05, 1] },
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 } satisfies Transition,
    }
  }
  if (condition.includes('snow')) {
    return {
      emoji: '❄️',
      animation: { rotate: [0, 360], y: [0, -4, 0] },
      transition: {
        rotate: { duration: 8, repeat: Infinity, ease: 'linear' as const },
        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
      },
    }
  }
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return {
      emoji: '🌧️',
      animation: { y: [0, -3, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } satisfies Transition,
    }
  }
  if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    return {
      emoji: '🌫️',
      animation: { opacity: [0.7, 1, 0.7], x: [-2, 2, -2] },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } satisfies Transition,
    }
  }
  if (condition.includes('cloud') || condition.includes('overcast')) {
    return {
      emoji: '⛅',
      animation: { x: [-4, 4, -4] },
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } satisfies Transition,
    }
  }
  return {
    emoji: '☀️',
    animation: { rotate: [0, 360], scale: [1, 1.08, 1] },
    transition: {
      rotate: { duration: 12, repeat: Infinity, ease: 'linear' as const },
      scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
  }
}
