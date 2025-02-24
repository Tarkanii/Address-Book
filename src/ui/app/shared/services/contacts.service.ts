import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, from, map, Observable, take } from "rxjs";
import { IContact, IContactFormValue } from "../types/contact";
import { SortingEnum } from "../types/sorting.enum";
import { defaultContacts } from "../defaultValues/contacts";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  // Contacts for testing

  constructor() {
    this.getSavedContacts();
  }

  // Saved contacts
  public contacts$: BehaviorSubject<IContact[]> = new BehaviorSubject<IContact[]>([]);
  // Search value
  public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // Sorting value
  public sorting$: BehaviorSubject<string> = new BehaviorSubject<string>(SortingEnum.default);
  // Current page
  public currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  // Amount of contacts per page
  public limitPerPage: number = 5;
  
  // Gets ready to display contacts with search and sorting applied
  public getContacts(): Observable<IContact[]> {
    return combineLatest([this.contacts$, this.search$, this.sorting$, this.currentPage$]).pipe(
      map(([contacts, search, sorting, page]) => {
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
          return [...contacts].sort(this.sortBy('first_name')).slice((page - 1) * this.limitPerPage, (page - 1) * this.limitPerPage + this.limitPerPage);
        } else if (sorting === SortingEnum.lastName) {
          return [...contacts].sort(this.sortBy('last_name')).slice((page - 1) * this.limitPerPage, (page - 1) * this.limitPerPage + this.limitPerPage);
        }

        return contacts.slice((page - 1) * this.limitPerPage, (page - 1) * this.limitPerPage + this.limitPerPage);;
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

  // Saves contacts into LocalStorage or local file
  private saveContacts(): void {
    if (window.electronApi) {
      window.electronApi.saveContacts(this.contacts$.value);
    } else {
      localStorage.setItem('ab-ng-contacts', JSON.stringify(this.contacts$.value));
    }
  }

  // Gets saved contacts from LocalStorage or local file
  private getSavedContacts(): void {
    if (!window.electronApi) {
      const localStorageContacts = localStorage.getItem('ab-ng-contacts');
      if (localStorageContacts === null) {
        // Saving default contacts into localstorage there no previosly stored contacts
        this.contacts$.next(defaultContacts);
        this.saveContacts();
      } else {
        // Filling contacts$ with previosly saved contacts
        this.contacts$.next(JSON.parse(localStorageContacts));
      }
      return;
    }

    const savedContacts$ = from(window.electronApi.getContacts());
    savedContacts$.pipe(take(1)).subscribe((contacts: ContactsResponseType) => {
      if (contacts === null) {
        this.contacts$.next(defaultContacts);
        this.saveContacts();
        return;
      }
      
      this.contacts$.next(contacts);
    });
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
    this.saveContacts();
  }

  // Deletes contact
  public deleteContact(id: string): void {
    this.contacts$.next(this.contacts$.value.filter((contact: IContact) => contact.id !== id));
    this.saveContacts();
  }

  // Changes current page
  public changePage(page: number): void {
    this.currentPage$.next(page);
  }
}