const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('skye', {
  openDashboard: () => ipcRenderer.send('open-dashboard'),
  closeDashboard: () => ipcRenderer.send('close-dashboard'),
  minimizeDashboard: () => ipcRenderer.send('minimize-dashboard'),
  closeWidget: () => ipcRenderer.send('close-widget'),
  resizeWidget: (size) => ipcRenderer.send('resize-widget', size),
})
