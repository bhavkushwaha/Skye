export interface Coordinates {
  lat: number
  lon: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  humidity: number
  pressure: number
  visibility: number
  uv_index: number
  wind_speed: number
  wind_deg: number
  sunrise: number
  sunset: number
  condition: WeatherCondition
  city: string
  country: string
  coords: Coordinates
  dt: number
}

export interface HourlyForecast {
  dt: number
  temp: number
  feels_like: number
  humidity: number
  wind_speed: number
  condition: WeatherCondition
  pop: number
}

export interface DailyForecast {
  dt: number
  temp_min: number
  temp_max: number
  humidity: number
  wind_speed: number
  condition: WeatherCondition
  pop: number
  uv_index: number
}

export interface AQIData {
  aqi: number
  label: string
  color: string
  components: {
    co: number
    no2: number
    o3: number
    pm2_5: number
    pm10: number
    so2: number
  }
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  aqi: AQIData
}

export type WeatherTheme =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'

export type WidgetSize = 'small' | 'medium' | 'large'

export interface SavedLocation {
  id: string
  name: string
  country: string
  coords: Coordinates
  isFavorite: boolean
}
