const path = require('path');
const { app, BrowserWindow } = require('electron');
const { startServer } = require('../backend/src/server');

let backendRef;

async function createWindow() {
  if (!backendRef) {
    backendRef = await startServer(3001);
  }

  process.env.API_BASE = 'http://localhost:3001';

  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  await win.loadFile(path.join(__dirname, '..', 'frontend', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', async () => {
  if (backendRef?.server) {
    backendRef.server.close();
  }
  if (backendRef?.sqliteDb) {
    await backendRef.sqliteDb.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
