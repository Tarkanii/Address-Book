import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IContact, IContactFormValue } from "../types/contact";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  // Saved contacts
  public contacts$: BehaviorSubject<IContact[]> = new BehaviorSubject<IContact[]>([]);

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