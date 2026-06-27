import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X, MapPin, Star } from 'lucide-react'
import { searchCity } from '@/api/weather'
import { useWeatherStore } from '@/store/weatherStore'
import type { GeoResult } from '@/api/weather'

interface Props {
  onClose: () => void
}

export function LocationSearch({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { setActiveLocation, savedLocations, addSavedLocation } = useWeatherStore()

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await searchCity(query)
        setResults(res)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function selectLocation(result: GeoResult) {
    const loc = {
      id: `${result.latitude}-${result.longitude}`,
      name: result.name,
      country: result.country_code,
      coords: { lat: result.latitude, lon: result.longitude },
      isFavorite: false,
    }
    setActiveLocation(loc)
    addSavedLocation(loc)
    onClose()
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-strong rounded-2xl p-4 w-full max-w-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 mb-3">
          <Search size={14} className="text-white/50 flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white/70">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Saved locations */}
        {!query && savedLocations.length > 0 && (
          <div className="mb-3">
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Saved</div>
            {savedLocations.slice(0, 3).map((loc) => (
              <button
                key={loc.id}
                onClick={() => { setActiveLocation(loc); onClose() }}
                className="w-full flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <Star size={12} className={loc.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-white/30'} />
                <span className="text-white text-sm">{loc.name}</span>
                <span className="text-white/40 text-xs ml-auto">{loc.country}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search results */}
        {isSearching && (
          <div className="text-white/40 text-xs text-center py-4">Searching...</div>
        )}
        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => selectLocation(r)}
            className="w-full flex items-center gap-2 py-2.5 px-2 rounded-lg hover:bg-white/10 transition-colors text-left"
          >
            <MapPin size={12} className="text-white/40 flex-shrink-0" />
            <div>
              <div className="text-white text-sm font-medium">{r.name}</div>
              <div className="text-white/40 text-xs">{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</div>
            </div>
          </button>
        ))}
      </motion.div>
    </motion.div>
  )
}
