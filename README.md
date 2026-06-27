# Skye — Desktop Weather App

A premium desktop weather application built with Electron, React, and TypeScript. Features a floating widget that sits on your desktop, an expanded dashboard with detailed forecasts and AQI data, animated weather backgrounds, and smooth Framer Motion transitions — all powered by free, key-less APIs.

---

## For Users

### Running the App

1. Double-click **`Skye-Setup.exe`** on your Desktop.
2. Windows may show a SmartScreen warning — click **More info → Run anyway** (this is normal for unsigned apps).
3. The app self-extracts and launches. You'll see the weather widget in the bottom-right of your screen.

### Using the Widget

| Action | What happens |
|---|---|
| Hover over widget | Close (×) button appears top-right |
| Click the widget body | Opens full Dashboard window |
| Click × | Quits the app |

The widget sits **below** other open windows — it won't interrupt your work. It auto-refreshes weather data every 10 minutes.

### Using the Dashboard

| Action | What happens |
|---|---|
| Red circle (top-left) | Closes dashboard, returns to widget |
| Yellow circle | Minimizes dashboard |
| Search bar (top-right) | Search and switch cities |
| °C / °F toggle | Switches temperature unit |

The dashboard shows:
- Current conditions with animated weather background
- AQI (Air Quality Index) orb with color coding
- 24-hour hourly forecast with temperature bars
- 7-day daily forecast with min/max range
- Metrics: humidity, wind speed, UV index, pressure, visibility, feels like

### Saving Locations

Search for a city in the dashboard, then click on it. The app remembers your saved locations between sessions — click the search icon again to switch.

---

## For Developers

### Prerequisites

- **Node.js** 20+ (install from nodejs.org)
- **npm** 10+ (comes with Node)
- **VS Code** (recommended)

### Initial Setup

```bash
# Open the project folder in VS Code terminal
cd "C:\Users\Bhav\OneDrive\Desktop\MyProjects\WeatherApp"

# Install dependencies
npm install
```

### Running in Development (VS Code)

```bash
npm run electron:dev
```

This starts two processes concurrently:
1. **Vite dev server** on `http://localhost:5173` with Hot Module Replacement (HMR)
2. **Electron** — waits for Vite to be ready, then opens the app

Changes to React/CSS files hot-reload instantly. Changes to `electron/main.cjs` or `electron/preload.cjs` require a full restart (`Ctrl+C`, then `npm run electron:dev` again).

### VS Code Tips

1. Open the `WeatherApp` folder: **File → Open Folder**
2. Open the integrated terminal: `Ctrl+\``
3. Run `npm run electron:dev`
4. Edit any file in `src/` — the Electron window updates automatically

Recommended VS Code extensions:
- **ES7+ React/Redux/React-Native snippets** — React component shortcuts
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **TypeScript Vue Plugin / Error Lens** — inline TypeScript errors

### Building the Executable

> **Important:** The build output is hardcoded to `C:\SkyeBuild\` because electron-builder cannot write to OneDrive-synced paths (causes EPERM rename errors).

```bash
# Step 1: TypeScript compile + Vite bundle
npm run build

# Step 2: Package into portable single-file EXE
node_modules\.bin\electron-builder.cmd --win portable
```

Output: `C:\SkyeBuild\Skye-Setup.exe` (~90 MB self-extracting portable executable)

To update your desktop shortcut after a rebuild:
```powershell
Copy-Item "C:\SkyeBuild\Skye-Setup.exe" "C:\Users\Bhav\Desktop\Skye.exe" -Force
```

---

## Architecture

```
WeatherApp/
├── electron/
│   ├── main.cjs           # Main process — creates two windows, handles IPC
│   └── preload.cjs        # Context bridge — exposes window.skye API to React
├── src/
│   ├── App.tsx            # Mode detection (?mode=widget vs ?mode=dashboard)
│   ├── index.css          # Tailwind v4 import + custom glass/animation classes
│   ├── api/
│   │   └── weather.ts     # All API calls (Open-Meteo, Nominatim geocoding)
│   ├── store/
│   │   └── weatherStore.ts # Zustand global state with localStorage persistence
│   ├── hooks/
│   │   └── useWeather.ts   # Auto-fetch hook — 10-min refresh + mock fallback
│   ├── lib/
│   │   └── utils.ts        # Helpers: cn(), getWeatherTheme(), getSmartSummary()
│   ├── types/
│   │   └── weather.ts      # TypeScript interfaces for all data shapes
│   └── components/
│       ├── effects/
│       │   └── WeatherBackground.tsx  # 9 animated weather themes
│       ├── ui/
│       │   ├── WeatherIcon.tsx        # Animated emoji weather icons
│       │   └── AQIOrb.tsx            # SVG circular progress with pulse animation
│       ├── widget/
│       │   └── Widget.tsx            # Floating desktop widget
│       └── dashboard/
│           ├── Dashboard.tsx          # Main dashboard layout
│           ├── MetricsGrid.tsx        # 6-card grid (humidity, wind, UV, etc.)
│           ├── HourlyForecast.tsx     # 24-hour horizontal scroll
│           ├── DailyForecast.tsx      # 7-day forecast list
│           └── LocationSearch.tsx    # City search overlay
├── build/
│   └── icon.png           # App icon (512×512 PNG)
├── vite.config.ts
├── tsconfig.app.json
└── package.json           # Also contains electron-builder config under "build" key
```

### Two-Window Architecture

Electron opens two `BrowserWindow` instances loading the **same** Vite build (`dist/index.html`), differentiated by a URL parameter:

- `?mode=widget` → renders `<Widget />` — 320×210px, transparent, frameless, no taskbar button
- `?mode=dashboard` → renders `<Dashboard />` — 1160×740px, centered, frameless

The widget uses `alwaysOnTop: false` so your other apps sit in front of it normally.

### IPC Communication (React ↔ Electron)

The React UI talks to Electron through a typed bridge defined in `preload.cjs`:

```
React component
  → window.skye.openDashboard()
  → preload.cjs: ipcRenderer.send('open-dashboard')
  → main.cjs: ipcMain.on('open-dashboard', () => dashboardWindow.show())
```

| IPC channel | Triggered by | Effect |
|---|---|---|
| `open-dashboard` | Widget body click | Shows dashboard window |
| `close-dashboard` | Red circle button | Hides dashboard |
| `minimize-dashboard` | Yellow circle button | Minimizes dashboard |
| `close-widget` | Widget × hover button | `app.quit()` |
| `resize-widget` | Internal | Resizes widget window |

### Data Flow

```
useWeather() hook (runs on mount + every 10 min)
  └─ fetchWeather(lat, lon)                        [src/api/weather.ts]
       ├─ Open-Meteo /v1/forecast        → current + hourly + daily weather
       ├─ Open-Meteo /v1/air-quality     → AQI (PM2.5, PM10, European index)
       └─ Nominatim reverse geocode      → city name from coordinates
  └─ Zustand weatherStore                          [src/store/weatherStore.ts]
       └─ Persisted to localStorage (survives app restart)
  └─ All components read from store via useWeatherStore()
```

If geolocation permission is denied or the network is unavailable, `useWeather.ts` falls back to mock data so the UI never shows a blank screen.

---

## Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Desktop shell | Electron | 42 | Cross-platform, no Rust/Go needed |
| UI | React + TypeScript | 19 / 6 | Strict types, component model |
| Bundler | Vite | 8 | Sub-second HMR, native ESM |
| Styling | Tailwind CSS v4 | 4 | CSS-first config, no config file |
| Animations | Framer Motion | 12 | Declarative enter/exit animations |
| State | Zustand + persist | 5 | Minimal boilerplate, localStorage sync |
| Weather data | Open-Meteo | — | Free, no API key, WMO standard |
| City search | Open-Meteo Geocoding | — | Free, no API key |
| Reverse geocoding | Nominatim (OSM) | — | Free, lat/lon → city name |
| Packaging | electron-builder | 26 | Portable single-file EXE |

---

## APIs Used

All APIs are **free with no API key required**.

### Open-Meteo Weather
Fetches current conditions, hourly (24h), and daily (7-day) forecasts.
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=28.63&longitude=77.22
  &current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,...
  &hourly=temperature_2m,precipitation_probability,weathercode
  &daily=temperature_2m_max,temperature_2m_min,weathercode,uv_index_max
  &timezone=auto
```

### Open-Meteo Air Quality
Fetches PM2.5, PM10, and the European AQI index.
```
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude=28.63&longitude=77.22
  &current=pm2_5,pm10,european_aqi
```

### Open-Meteo Geocoding (city search)
Used in the LocationSearch component with 300ms debounce.
```
GET https://geocoding-api.open-meteo.com/v1/search
  ?name=London&count=5&language=en&format=json
```

### Nominatim Reverse Geocoding
Converts GPS coordinates to a human-readable city name.
```
GET https://nominatim.openstreetmap.org/reverse
  ?format=json&lat=28.63&lon=77.22
```

---

## Key Quirks & Gotchas

**Tailwind v4 arbitrary values don't work reliably here**
`w-[320px]` resolves to ~1px in some environments. All fixed pixel dimensions use `style={{ width: N, height: N }}` inline.

**Electron main process must stay CJS**
`electron/main.cjs` and `electron/preload.cjs` use CommonJS. The `package.json` has `"type": "module"` for the React side, so these files use `.cjs` extension to stay CommonJS. Do not rename them to `.js`.

**Build must go to a local path (not OneDrive)**
electron-builder renames temp directories atomically. OneDrive intercepts these renames → `EPERM`. Output is set to `C:\SkyeBuild` in `package.json → build.directories.output`.

**`base: './'` in vite.config.ts is required**
Without it, Vite generates absolute asset paths (`/assets/...`) which break when Electron loads the app via `file://` protocol.

**WMO weather codes**
Open-Meteo uses World Meteorological Organization codes (0 = clear sky, 61 = slight rain, 95 = thunderstorm). These are different from OpenWeatherMap's codes. The full mapping is in `src/api/weather.ts → mapWeatherCode()`.

---

## Upcoming Features (v2 Ideas)

- [ ] Sunrise / sunset with golden-hour indicator
- [ ] Multiple simultaneous widget cities
- [ ] System tray icon showing current temperature
- [ ] Auto-launch on Windows startup (registry entry)
- [ ] Desktop notifications for weather alerts
- [ ] Historical weather charts (Open-Meteo supports archive endpoint)
- [ ] Hourly wind direction compass
- [ ] Custom widget color themes

---

## Troubleshooting

**SmartScreen blocks the EXE**
Click "More info" → "Run anyway". This appears because the app is unsigned (no code signing certificate).

**Widget shows mock data / wrong city**
The app uses browser geolocation. If denied, open the dashboard and search for your city manually.

**`EPERM rename` error during build**
You're accidentally building to an OneDrive path. The output directory in `package.json` is already set to `C:\SkyeBuild` — make sure you haven't changed it.

**HMR stops working after deleting/renaming a component**
Vite's module graph caches the old import. Restart: `Ctrl+C` → `npm run electron:dev`.

**Dashboard appears blank / wrong size**
Run `npm run build` fresh and reopen Electron. A stale `dist/` from a previous failed build can cause layout issues.

---

Built by Bhav · 2026
