import { app, ipcMain } from 'electron'
import path from 'path';

export function getPreloadPath(): string {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/dist-electron/preload.cjs');
}

export function getSavedDataPath(): string {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', 'savedData');
}

export function getSavedContactsPath(): string {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', 'savedData/contacts.json');
}

export function getIconPath(): string {
  return path.join(path.join(app.getAppPath(), isDev() ? '.' : '..', 'public/icon.ico'));
}

// Returns whether app runs in development mode
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Wrapper for ipcMain.handler function for types safety
export function ipcMainHadler<Key extends keyof EventPayloadMapping>(key: Key, handler: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<EventPayloadMapping[Key]>) {
  ipcMain.handle(key, (event: Electron.IpcMainInvokeEvent, ...args: any[]) => handler(event, ...args));
}