// Can add additional fields in the future e.g. 'imageLink'
export interface IContact {
  id: string,
  first_name: string,
  last_name: string,
  phone_number?: string
}

export interface IContactFormValue {
  firstName: string,
  lastName: string,
  phoneNumber: string
}