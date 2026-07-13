const { app, BrowserWindow, ipcMain, session, Notification } = require('electron');
const path = require('path');

// LINUX PERFORMANCE PATCH: Bypasses faulty hardware acceleration layers to fix YouTube video borders and lag
if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
}

app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');

// SPLIT-ROUTING IDENTITIES
const STANDARD_CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const DDG_MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 DuckDuckGo/7';

app.userAgentFallback = STANDARD_CHROME_UA;
const PARTITION = 'persist:ddg_auth';

let mainWindow;
let authWindow = null;

function applyTrafficRouting(sess) {
  // AD-BLOCK LAYER 1: EXTERNAL NETWORK FIREWALL
  const adFilterPatterns = [
    '*://*.doubleclick.net/*',
    '*://*.googleadservices.com/*',
    '*://*.googlesyndication.com/*',
    '*://*.pagead2.googlesyndication.com/*',
    '*://*.adservice.google.com/*',
    '*://*.amazon-adsystem.com/*'
  ];
  
  sess.webRequest.onBeforeRequest({ urls: adFilterPatterns }, (details, callback) => {
    callback({ cancel: true });
  });

  // IDENTITY ROUTING PIPELINE
  sess.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = details.requestHeaders;
    const url = details.url.toLowerCase();

    Object.keys(headers).forEach(key => {
      if (key.toLowerCase().includes('electron')) {
        delete headers[key];
      }
    });

    if (url.includes('accounts.google.com') || url.includes('google.com/signin')) {
      Object.keys(headers).forEach(key => {
        if (key.toLowerCase().startsWith('sec-ch-ua')) {
          delete headers[key];
        }
      });
      headers['User-Agent'] = DDG_MOBILE_UA;
    } else {
      headers['User-Agent'] = STANDARD_CHROME_UA;
    }

    callback({ requestHeaders: headers });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      webSecurity: false,
      backgroundThrottling: false // 🚀 CRITICAL FOR POMODORO: Keeps timers running at full speed when app minimizes
    }
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.on('close', (e) => { 
    if (mainWindow.isLockedDown) e.preventDefault(); 
  });

  // LINUX FULLSCREEN EXIT FIX
  mainWindow.on('leave-html-full-screen', () => {
    if (mainWindow.isLockedDown) {
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.setKiosk(false); 
          mainWindow.setKiosk(true);  
          mainWindow.setFullScreen(true);
          mainWindow.focus();
        }
      }, 100);
    }
  });
}

// Lifecycle Initialization
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

// Manual Google Authentication Channel
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

// Strict Window Enforcement (Lockdown Mode)
ipcMain.on('lock-window', () => { 
  mainWindow.isLockedDown = true; 
  if (mainWindow.isMinimized()) mainWindow.restore(); // Pull back up out of the taskbar
  mainWindow.setKiosk(true); 
  mainWindow.setFullScreen(true);
  mainWindow.setAlwaysOnTop(true, 'screen-saver'); 
  mainWindow.focus(); 
});

// 🚀 NEW: Pomodoro Break State Trigger
ipcMain.on('start-break', () => {
  mainWindow.isLockedDown = false; // Allow app to be closed during break if finished
  mainWindow.setKiosk(false); 
  mainWindow.setFullScreen(false);
  mainWindow.setAlwaysOnTop(false); 
  mainWindow.minimize(); // Send window down to the tray so they can switch OS tabs freely
});

ipcMain.on('unlock-window', () => { 
  mainWindow.isLockedDown = false; 
  mainWindow.setAlwaysOnTop(false); 
});

// Native OS Battery Notification Receiver
ipcMain.on('notify-battery', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

app.on('window-all-closed', () => { 
  if (process.platform !== 'darwin') app.quit(); 
});
