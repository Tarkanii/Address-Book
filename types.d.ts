interface IContact {
  id: string,
  first_name: string,
  last_name: string,
  phone_number?: string
}

type ContactsResponseType = IContact[] | null;

type SaveResponseType = {
  message: 'Error' | 'Success'
};

interface Window {
  electronApi: {
    getContacts: () => Promise<ContactsResponseType>,
    saveContacts: (contacts: IContact[]) => Promise<SaveResponseType>
  }
}

interface EventPayloadMapping {
  getContacts: ContactsResponseType,
  saveContacts: SaveResponseType
}