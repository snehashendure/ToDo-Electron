const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('APP_CONFIG', {
  apiBase: process.env.API_BASE || 'http://localhost:3001'
});
