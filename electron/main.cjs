const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')
const isDev = !app.isPackaged

let mainWindow = null
let widgetWindow = null

function createWidget() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  widgetWindow = new BrowserWindow({
    width: 320,
    height: 210,
    x: width - 340,
    y: height - 230,
    frame: false,
    transparent: true,
    alwaysOnTop: false,      // stays below other apps
    resizable: false,
    skipTaskbar: true,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  const url = isDev
    ? 'http://localhost:5173/?mode=widget'
    : `file://${path.join(__dirname, '../dist/index.html')}?mode=widget`

  widgetWindow.loadURL(url)

  widgetWindow.on('closed', () => { widgetWindow = null })
}

function createDashboard() {
  if (mainWindow) { mainWindow.focus(); return }

  mainWindow = new BrowserWindow({
    width: 1160,
    height: 740,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: true,
    hasShadow: true,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  const url = isDev
    ? 'http://localhost:5173/?mode=dashboard'
    : `file://${path.join(__dirname, '../dist/index.html')}?mode=dashboard`

  mainWindow.loadURL(url)
  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' })
  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(createWidget)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('open-dashboard', createDashboard)
ipcMain.on('close-dashboard', () => mainWindow?.close())
ipcMain.on('minimize-dashboard', () => mainWindow?.minimize())
ipcMain.on('close-widget', () => { widgetWindow?.close(); app.quit() })

ipcMain.on('resize-widget', (_e, size) => {
  if (!widgetWindow) return
  const sizes = { small: [280, 170], medium: [320, 210], large: [380, 270] }
  const [w, h] = sizes[size] || sizes.medium
  widgetWindow.setSize(w, h, true)
})

// drag support for widget
ipcMain.on('widget-drag', (_e, { dx, dy }) => {
  if (!widgetWindow) return
  const [x, y] = widgetWindow.getPosition()
  widgetWindow.setPosition(x + dx, y + dy)
})
