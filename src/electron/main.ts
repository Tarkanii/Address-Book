import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getIconPath, getPreloadPath, ipcMainHadler, isDev } from './utils.js';
import { saveContactsHandler, getContactsHandler } from './handlers.js';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    icon: getIconPath(),
    webPreferences: {
      preload: getPreloadPath()
    }
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:4200/');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-ng/address-book/browser/index.html'));
  }
}

app.on('ready', () => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMainHadler('getContacts', getContactsHandler);
  ipcMainHadler('saveContacts', saveContactsHandler);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});