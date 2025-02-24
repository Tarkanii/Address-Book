const { ipcRenderer, contextBridge}: typeof Electron = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  getContacts: () => ipcRenderer.invoke('getContacts'),
  saveContacts: (contacts: IContact[]) => ipcRenderer.invoke('saveContacts', contacts)
} satisfies Window['electronApi']);