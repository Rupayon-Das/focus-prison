const { app, BrowserWindow, ipcMain, session, Notification } = require('electron');
const path = require('path');

// 🚀 LINUX YOUTUBE FIX: Disables the buggy graphics acceleration layer
// This removes the black borders and stabilizes video playback frame rates.
if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
}

app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');

// 🚀 THE SPLIT-IDENTITY STRATEGY
// DeepSeek needs standard Chrome to prevent JavaScript crashes.
// Google Auth needs DuckDuckGo Mobile to bypass BotGuard.
const STANDARD_CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const DDG_MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 DuckDuckGo/7';

app.userAgentFallback = STANDARD_CHROME_UA;
const PARTITION = 'persist:ddg_auth';

let mainWindow;
let authWindow = null;

function applyTrafficRouting(sess) {
  sess.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = details.requestHeaders;
    const url = details.url.toLowerCase();

    // Clean out all native Electron trace indicators from every request header
    Object.keys(headers).forEach(key => {
      if (key.toLowerCase().includes('electron')) {
        delete headers[key];
      }
    });

    // 🚀 DYNAMIC ROUTING: Only spoof DuckDuckGo Mobile when explicitly hitting Google Auth endpoints
    if (url.includes('accounts.google.com') || url.includes('google.com/signin')) {
      Object.keys(headers).forEach(key => {
        if (key.toLowerCase().startsWith('sec-ch-ua')) {
          delete headers[key];
        }
      });
      headers['User-Agent'] = DDG_MOBILE_UA;
    } else {
      // For DeepSeek and all other standard learning sites, serve pristine Chrome headers
      headers['User-Agent'] = STANDARD_CHROME_UA;
    }

    callback({ requestHeaders: headers });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true, kiosk: true,
    resizable: false, movable: false,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false, webviewTag: true, spellcheck: false, webSecurity: false,
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('close', (e) => { if (mainWindow.isLockedDown) e.preventDefault(); });
}

app.whenReady().then(() => {
  applyTrafficRouting(session.defaultSession);
  applyTrafficRouting(session.fromPartition(PARTITION));

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

ipcMain.on('lock-window', () => { mainWindow.isLockedDown = true; mainWindow.setAlwaysOnTop(true, 'screen-saver'); mainWindow.focus(); });
ipcMain.on('unlock-window', () => { mainWindow.isLockedDown = false; mainWindow.setAlwaysOnTop(false); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// Native desktop notification trigger
ipcMain.on('notify-battery', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});
