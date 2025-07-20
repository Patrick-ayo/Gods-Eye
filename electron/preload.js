// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Send data to main process
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ['backend-request', 'app-quit', 'window-minimize', 'window-maximize'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Receive data from main process
  receive: (channel, func) => {
    const validChannels = ['backend-response', 'app-status'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender` 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  // Remove listener
  removeListener: (channel, func) => {
    const validChannels = ['backend-response', 'app-status'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, func);
    }
  },
  
  // Get app version
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Get platform
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // Backend communication
  sendToBackend: (data) => ipcRenderer.send('backend-request', data),
  onBackendResponse: (callback) => {
    ipcRenderer.on('backend-response', (event, data) => callback(data));
  },
  
  // System information
  getBatteryInfo: () => ipcRenderer.invoke('get-battery-info'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info')
});
