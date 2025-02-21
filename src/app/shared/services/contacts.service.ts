import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable } from "rxjs";
import { IContact, IContactFormValue } from "../types/contact";
import { SortingEnum } from "../types/sorting.enum";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  // Contacts for testing
  private defaultContacts: IContact[] = [
    { id: '0', first_name: 'Bob', last_name: 'Marley', phone_number: '+44770000000' },
    { id: '1', first_name: 'Rob', last_name: 'Passey', phone_number: '+44770000000' },
    { id: '2', first_name: 'Jay', last_name: 'Ancel', phone_number: '+44770000000' },
    { id: '3', first_name: 'Aaron', last_name: 'Reiser', phone_number: '+44770000000' },
    { id: '4', first_name: 'Reece', last_name: 'Bloated', phone_number: '+44770000000' },
    { id: '5', first_name: 'Jake', last_name: 'Ancel', phone_number: '+44770000000' },
    { id: '6', first_name: 'Ashton', last_name: 'Reiser', phone_number: '+44770000000' },
    { id: '7', first_name: 'Terry', last_name: 'Bloated', phone_number: '+44770000000' },
  ]

  // Saved contacts
  public contacts$: BehaviorSubject<IContact[]> = new BehaviorSubject<IContact[]>(this.defaultContacts);
  // Search Value
  public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // Sorting Value
  public sorting$: BehaviorSubject<string> = new BehaviorSubject<string>(SortingEnum.default);
  
  public getContacts(): Observable<IContact[]> {
    return combineLatest([this.contacts$, this.search$, this.sorting$]).pipe(
      map(([contacts, search, sorting]) => {
        // Filtering contacts by search value if there is one
        if (search.length > 0) {
          search = search.toLowerCase();
          contacts = contacts.filter((contact: IContact) => {
            const firstName = contact.first_name.toLowerCase();
            const lastName = contact.last_name.toLowerCase();

            return firstName.slice(0, search.length) === search || lastName.slice(0, search.length) === search;
          });
        }

        // Sorting contacts depending on the sorting value
        if (sorting === SortingEnum.firstName) {
          return [...contacts].sort(this.sortBy('first_name'));
        } else if (sorting === SortingEnum.lastName) {
          return [...contacts].sort(this.sortBy('last_name'));
        }

        return contacts;
      })
    );
  }

  // Returns sorting function for Array.sort
  private sortBy(field: keyof IContact): (a: IContact, b: IContact) => number {
    return (a, b) => {
      if (!a[field] || !b[field]) return 0;

      const value1 = a[field].toUpperCase();
      const value2 = b[field].toUpperCase();

      if (value1 < value2) return -1;
      if (value1 > value2) return 1;
      return 0;
    }
  }

  // Adds contact from 'addContactForm' values
  public addContact({ firstName, lastName, phoneNumber }: IContactFormValue): void {
    const newContact: IContact = {
      id: Math.random().toString(16),
      first_name: firstName,
      last_name: lastName
    }

    if (phoneNumber.length) {
      newContact.phone_number = phoneNumber;
    }
     
    this.contacts$.next([newContact, ...this.contacts$.value]);
  }

  // Deletes contact
  public deleteContact(id: string): void {
    this.contacts$.next(this.contacts$.value.filter((contact: IContact) => contact.id !== id));
  }
}