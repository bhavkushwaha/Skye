import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeatherData, SavedLocation, WidgetSize } from '@/types/weather'

interface WeatherStore {
  weather: WeatherData | null
  isLoading: boolean
  error: string | null
  unit: 'C' | 'F'
  widgetSize: WidgetSize
  savedLocations: SavedLocation[]
  activeLocation: SavedLocation | null
  lastUpdated: number | null

  setWeather: (data: WeatherData) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  setUnit: (u: 'C' | 'F') => void
  setWidgetSize: (s: WidgetSize) => void
  setActiveLocation: (loc: SavedLocation | null) => void
  addSavedLocation: (loc: SavedLocation) => void
  removeSavedLocation: (id: string) => void
  toggleFavorite: (id: string) => void
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      weather: null,
      isLoading: false,
      error: null,
      unit: 'C',
      widgetSize: 'medium',
      savedLocations: [],
      activeLocation: null,
      lastUpdated: null,

      setWeather: (data) => set({ weather: data, lastUpdated: Date.now(), error: null }),
      setLoading: (v) => set({ isLoading: v }),
      setError: (e) => set({ error: e, isLoading: false }),
      setUnit: (u) => set({ unit: u }),
      setWidgetSize: (s) => set({ widgetSize: s }),
      setActiveLocation: (loc) => set({ activeLocation: loc }),
      addSavedLocation: (loc) =>
        set((state) => ({
          savedLocations: state.savedLocations.some((l) => l.id === loc.id)
            ? state.savedLocations
            : [...state.savedLocations, loc],
        })),
      removeSavedLocation: (id) =>
        set((state) => ({ savedLocations: state.savedLocations.filter((l) => l.id !== id) })),
      toggleFavorite: (id) =>
        set((state) => ({
          savedLocations: state.savedLocations.map((l) =>
            l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
          ),
        })),
    }),
    {
      name: 'skye-weather-store',
      partialize: (state) => ({
        unit: state.unit,
        widgetSize: state.widgetSize,
        savedLocations: state.savedLocations,
        activeLocation: state.activeLocation,
      }),
    }
  )
)
