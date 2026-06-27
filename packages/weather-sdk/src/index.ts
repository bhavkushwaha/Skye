import axios from 'axios'
import type { CurrentWeather, HourlyForecast, DailyForecast, AQIData, WeatherData, Coordinates } from '@skye/types'
import { getAQIData, getAQIColor } from '@skye/core'

// Using Open-Meteo (free, no key needed) + OpenWeatherMap for AQI
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1'
const WEATHER_BASE = 'https://api.open-meteo.com/v1'
const AQI_BASE = 'https://air-quality-api.open-meteo.com/v1'

export interface GeoResult {
  id: number
  name: string
  country: string
  country_code: string
  latitude: number
  longitude: number
  admin1?: string
}

export async function searchCity(query: string): Promise<GeoResult[]> {
  const { data } = await axios.get(`${GEO_BASE}/search`, {
    params: { name: query, count: 5, language: 'en', format: 'json' },
  })
  return data.results || []
}

export async function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000 }
    )
  })
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; country: string }> {
  try {
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: { lat, lon, format: 'json' },
      headers: { 'Accept-Language': 'en' },
    })
    return {
      city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
      country: data.address?.country_code?.toUpperCase() || '',
    }
  } catch {
    return { city: 'Unknown', country: '' }
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const [weatherRes, aqiRes, geo] = await Promise.all([
    axios.get(`${WEATHER_BASE}/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          'temperature_2m', 'apparent_temperature', 'relative_humidity_2m',
          'wind_speed_10m', 'wind_direction_10m', 'weather_code',
          'surface_pressure', 'visibility', 'is_day', 'uv_index',
        ].join(','),
        hourly: [
          'temperature_2m', 'apparent_temperature', 'relative_humidity_2m',
          'wind_speed_10m', 'weather_code', 'precipitation_probability',
        ].join(','),
        daily: [
          'temperature_2m_max', 'temperature_2m_min', 'weather_code',
          'wind_speed_10m_max', 'precipitation_probability_max', 'uv_index_max',
          'sunrise', 'sunset',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      },
    }),
    axios.get(`${AQI_BASE}/air-quality`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: ['us_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'ozone', 'sulphur_dioxide'].join(','),
      },
    }),
    reverseGeocode(lat, lon),
  ])

  const w = weatherRes.data
  const c = w.current
  const aqiRaw = aqiRes.data.current

  const condition = mapWeatherCode(c.weather_code, c.is_day === 1)
  const sunriseTs = Math.floor(new Date(w.daily.sunrise[0]).getTime() / 1000)
  const sunsetTs = Math.floor(new Date(w.daily.sunset[0]).getTime() / 1000)

  const current: CurrentWeather = {
    temp: c.temperature_2m,
    feels_like: c.apparent_temperature,
    temp_min: w.daily.temperature_2m_min[0],
    temp_max: w.daily.temperature_2m_max[0],
    humidity: c.relative_humidity_2m,
    pressure: c.surface_pressure,
    visibility: (c.visibility || 10000) / 1000,
    uv_index: c.uv_index || 0,
    wind_speed: c.wind_speed_10m,
    wind_deg: c.wind_direction_10m,
    sunrise: sunriseTs,
    sunset: sunsetTs,
    condition,
    city: geo.city,
    country: geo.country,
    coords: { lat, lon },
    dt: Math.floor(Date.now() / 1000),
  }

  const now = new Date()
  const currentHour = now.getHours()
  const hourly: HourlyForecast[] = w.hourly.time
    .slice(currentHour, currentHour + 24)
    .map((time: string, i: number) => ({
      dt: Math.floor(new Date(time).getTime() / 1000),
      temp: w.hourly.temperature_2m[currentHour + i],
      feels_like: w.hourly.apparent_temperature[currentHour + i],
      humidity: w.hourly.relative_humidity_2m[currentHour + i],
      wind_speed: w.hourly.wind_speed_10m[currentHour + i],
      condition: mapWeatherCode(w.hourly.weather_code[currentHour + i], true),
      pop: w.hourly.precipitation_probability[currentHour + i] / 100,
    }))

  const daily: DailyForecast[] = w.daily.time.map((time: string, i: number) => ({
    dt: Math.floor(new Date(time).getTime() / 1000),
    temp_min: w.daily.temperature_2m_min[i],
    temp_max: w.daily.temperature_2m_max[i],
    humidity: 0,
    wind_speed: w.daily.wind_speed_10m_max[i],
    condition: mapWeatherCode(w.daily.weather_code[i], true),
    pop: w.daily.precipitation_probability_max[i] / 100,
    uv_index: w.daily.uv_index_max[i],
  }))

  const rawAqi = aqiRaw?.us_aqi || 42
  const aqi: AQIData = {
    aqi: rawAqi,
    label: getAQIData(rawAqi),
    color: getAQIColor(rawAqi),
    components: {
      co: aqiRaw?.carbon_monoxide || 0,
      no2: aqiRaw?.nitrogen_dioxide || 0,
      o3: aqiRaw?.ozone || 0,
      pm2_5: aqiRaw?.pm2_5 || 0,
      pm10: aqiRaw?.pm10 || 0,
      so2: aqiRaw?.sulphur_dioxide || 0,
    },
  }

  return { current, hourly, daily, aqi }
}

function mapWeatherCode(code: number, isDay: boolean): { id: number; main: string; description: string; icon: string } {
  // WMO weather codes to description
  const map: Record<number, { main: string; description: string }> = {
    0: { main: 'Clear', description: 'Clear sky' },
    1: { main: 'Clear', description: 'Mainly clear' },
    2: { main: 'Clouds', description: 'Partly cloudy' },
    3: { main: 'Clouds', description: 'Overcast' },
    45: { main: 'Fog', description: 'Foggy' },
    48: { main: 'Fog', description: 'Depositing rime fog' },
    51: { main: 'Drizzle', description: 'Light drizzle' },
    53: { main: 'Drizzle', description: 'Moderate drizzle' },
    55: { main: 'Drizzle', description: 'Dense drizzle' },
    61: { main: 'Rain', description: 'Slight rain' },
    63: { main: 'Rain', description: 'Moderate rain' },
    65: { main: 'Rain', description: 'Heavy rain' },
    71: { main: 'Snow', description: 'Slight snow' },
    73: { main: 'Snow', description: 'Moderate snow' },
    75: { main: 'Snow', description: 'Heavy snow' },
    80: { main: 'Rain', description: 'Slight rain showers' },
    81: { main: 'Rain', description: 'Moderate rain showers' },
    82: { main: 'Rain', description: 'Violent rain showers' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm' },
    96: { main: 'Thunderstorm', description: 'Thunderstorm with hail' },
    99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail' },
  }

  const entry = map[code] || { main: 'Clear', description: 'Clear sky' }
  const icon = isDay ? '01d' : '01n'

  return { id: code, ...entry, icon }
}
