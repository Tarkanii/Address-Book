import { IpcMainInvokeEvent } from 'electron'
import fs from 'fs/promises';
import { getSavedContactsPath, getSavedDataPath } from './utils.js';

// Gets contacts saved in local file
export async function getContactsHandler(_: IpcMainInvokeEvent): Promise<ContactsResponseType> {

  if (!(await isSavedDataFolderCreated())) return null;

  try {
    const stringifiedContacts = await fs.readFile(getSavedContactsPath(), 'utf-8');
    return JSON.parse(stringifiedContacts);
  } catch (error) {
    return null;
  }
}

// Saves contacts into local file
export async function saveContactsHandler(_: IpcMainInvokeEvent, contacts: IContact[]): Promise<SaveResponseType> {

  await isSavedDataFolderCreated();

  try {
    const stringifiedContacts = JSON.stringify(contacts);
    await fs.writeFile(getSavedContactsPath(), stringifiedContacts);
    return { message: 'Success'};
  } catch (error) {
    return { message: 'Error' };
  }
}

// Returns boolean and if not created creates it
async function isSavedDataFolderCreated(): Promise<boolean> {
  try {
    await fs.mkdir(getSavedDataPath());
    return false;
  } catch (error) {
    return true;
  }
}