import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { IContact } from '../../shared/types/contact';
import { ContactsService } from '../../shared/services/contacts.service';
import { ModalService } from '../../shared/services/modal.service';
import { ContactComponent } from '../contact/contact.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-contact-list',
  imports: [ContactComponent, PaginationComponent, AsyncPipe, NgClass],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {
  // Gets contacts from contactsService
  public displayContacts$: Observable<IContact[]>;
  // All saved contacts
  public contacts$: Observable<IContact[]>;
  // Search value
  public search$: BehaviorSubject<string>;
  // Current page
  public currentPage$: BehaviorSubject<number>;
  // Limit of contacts per page
  public limitPerPage: number;
  // Id of contact for deleting
  public deleteId: string | null = null;
  

  constructor(private contactsService: ContactsService, private modalService: ModalService) {
    this.contacts$ = this.contactsService.contacts$;
    this.displayContacts$ = this.contactsService.getContacts();
    this.search$ = this.contactsService.search$;
    this.currentPage$ = this.contactsService.currentPage$;
    this.limitPerPage = this.contactsService.limitPerPage;
  }

  // Opens 'addContact' form modal, closes deleting confirmation window if needed
  public openAddForm(): void {
    this.closeDeleteConfirmation();
    this.modalService.openModal('add-form');
  }

  // Opens delete confirmation window, closes adding contact form window if needed
  public openDeleteConfirmation(id: string): void {
    this.modalService.closeModal();
    this.deleteId = id;
  }

  // Closes deleting confirmation window when user clicks on backdrop or cancel button
  public closeDeleteConfirmation(e?: Event): void {
    if (!e) {
      this.deleteId = null;
      return;
    }

    if ((e.target as HTMLDivElement).classList.value.includes('backdrop')) {
      this.deleteId = null;
    }
  }

  // Deletes contact if Id is provided
  public deleteContact(): void {
    if (this.deleteId === null) return;
    this.contactsService.deleteContact(this.deleteId);
    this.deleteId = null;
  }

  // Changes page
  public changePage(page: number): void {
    this.contactsService.changePage(page);
  }

  // Gets amount of items for pagination
  public getContactsAmount(): Observable<number> {
    return combineLatest([this.search$, this.displayContacts$, this.contacts$]).pipe(
      map(([search, displayContacts, contacts]) => {
        if (search?.length) return displayContacts.length;

        return contacts.length;
      })
    )
  }
}
