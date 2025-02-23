import { app, BrowserWindow } from 'electron';
import path from 'path';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({});

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4200/');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-ng/address-book/browser/index.html'));
  }
});