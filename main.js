const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');

const DDG_DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 DuckDuckGo/7';
const DDG_MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 DuckDuckGo/7';

app.userAgentFallback = DDG_DESKTOP_UA;
const PARTITION = 'persist:ddg_auth';

let mainWindow;
let authWindow = null;

function applyDDGBypass(sess) {
  sess.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = details.requestHeaders;
    Object.keys(headers).forEach(key => {
      const lower = key.toLowerCase();
      if (lower.startsWith('sec-ch-ua') || lower.includes('electron')) {
        delete headers[key];
      }
    });
    callback({ requestHeaders: headers });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    // On Mac, kiosk hides the dock natively; on Windows/Linux it forces exclusive fullscreen
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      webSecurity: false,
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('close', (e) => { if (mainWindow.isLockedDown) e.preventDefault(); });
}

app.whenReady().then(() => {
  applyDDGBypass(session.defaultSession);
  applyDDGBypass(session.fromPartition(PARTITION));

  createWindow();

  app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      if (url.includes('accounts.google.com')) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            parent: mainWindow, alwaysOnTop: true, width: 450, height: 750, autoHideMenuBar: true,
            webPreferences: {
              partition: PARTITION, nodeIntegration: false, contextIsolation: true, webSecurity: true
            }
          }
        };
      }
      return { action: 'deny' };
    });

    contents.on('did-create-window', (window) => {
      window.webContents.setUserAgent(DDG_MOBILE_UA);
      window.on('closed', () => {
        if (mainWindow) { mainWindow.focus(); mainWindow.webContents.send('google-login-closed'); }
      });
    });
  });
});

ipcMain.on('open-manual-auth', (event, url) => {
  if (authWindow) { authWindow.focus(); return; }
  
  authWindow = new BrowserWindow({
    width: 450, height: 750, parent: mainWindow, modal: true, alwaysOnTop: true, autoHideMenuBar: true,
    webPreferences: { partition: PARTITION, nodeIntegration: false, contextIsolation: true, webSecurity: true }
  });
  
  authWindow.webContents.setUserAgent(DDG_MOBILE_UA);
  authWindow.loadURL(url);
  
  authWindow.webContents.on('did-navigate', (e, currentUrl) => {
    if (!currentUrl.includes('accounts.google.com') && !currentUrl.includes('ServiceLogin')) {
      setTimeout(() => { if (authWindow && !authWindow.isDestroyed()) authWindow.close(); }, 1500);
    }
  });

  authWindow.on('closed', () => {
    authWindow = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.focus();
      mainWindow.webContents.send('google-login-closed');
    }
  });
});

app.on('window-focus-changed', (event, focusedWindow) => {
  if (!mainWindow) return;
  if (!focusedWindow || focusedWindow === mainWindow) return;
  const isPopup = focusedWindow.getParentWindow() === mainWindow;
  if (!isPopup) mainWindow.focus();
});

ipcMain.on('lock-window', () => { 
  mainWindow.isLockedDown = true; 
  mainWindow.setAlwaysOnTop(true, 'screen-saver'); 
  mainWindow.focus(); 
});

ipcMain.on('unlock-window', () => { 
  mainWindow.isLockedDown = false; 
  mainWindow.setAlwaysOnTop(false); 
});

// Standard macOS lifestyle implementation: apps stay alive in the tray even when windows close
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });