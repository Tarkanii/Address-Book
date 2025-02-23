import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContactListComponent } from './contact-list.component';
import { ContactsService } from '../../shared/services/contacts.service';
import { ModalService } from '../../shared/services/modal.service';
import { ModalType } from '../../shared/types/modal';
import { IContact } from '../../shared/types/contact';
import { ContactComponent } from '../contact/contact.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({ selector: 'app-contact' })
class ContactComponentMock {
  // Contact info
    @Input({ required: true }) public contactId!: string;
    @Input({ required: true }) public firstName!: string;
    @Input({ required: true }) public lastName!: string;
    @Input({ required: true }) public phoneNumber!: string | undefined;
  
    // EventEmitter for confirmation window in parent component
    @Output() public delete: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'app-pagination' })
class PaginationComponentMock {
    // Input values
    @Input({ required: true }) public itemsAmount!: number | null;
    @Input({ required: true }) public itemsPerPage!: number;
    @Input() public currentPage: number = 1;
    @Output() public pageChanged: EventEmitter<number> = new EventEmitter();
}

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactsService: ContactsService;
  let modalService: ModalService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ContactListComponent]
    })
    .overrideComponent(ContactListComponent, {
      remove: { imports: [ContactComponent, PaginationComponent] },
      add: { imports: [ContactComponentMock, PaginationComponentMock] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactsService = TestBed.inject(ContactsService);
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  // ContactsListComponent
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  // openAddForm; tests
  describe('openAddForm', () => {
    it('opens add-form modal', () => {
      spyOn(modalService, 'openModal').and.callFake((modal: ModalType | null) => {});
      const addContactButton = fixture.debugElement.query(By.css('[data-testid=addContactButton]'));
      addContactButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(modalService.openModal).toHaveBeenCalledWith('add-form');
    });

    it('closes delete confirmation modal', () => {
      spyOn(modalService, 'openModal').and.callFake((modal: ModalType | null) => {});
      spyOn(component, 'closeDeleteConfirmation').and.callFake(() => {});
      const addContactButton = fixture.debugElement.query(By.css('[data-testid=addContactButton]'));
      addContactButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.closeDeleteConfirmation).toHaveBeenCalledTimes(1);
    });
  });

  // openDeleteConfirmation; tests
  describe('openDeleteConfirmation', () => {
    const contacts: IContact[] = [{ id: '0', first_name: 'Aaron', last_name: 'Bravo', phone_number: '1' }];
    let contactComponent: ContactComponentMock;

    beforeEach(() => {
      contactComponent = fixture.debugElement.query(By.css('[data-testid=contact]')).componentInstance as ContactComponentMock;
    });

    it('opens delete confirmation', () => {
      contactsService.contacts$.next(contacts);
      contactComponent.delete.emit('0');
      fixture.detectChanges();
      const modalBackdrop = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
      expect(modalBackdrop.classes['open']).toEqual(true);
    });

    it('closes other modals', () => {
      spyOn(modalService, 'closeModal').and.callFake(() => {});
      contactsService.contacts$.next(contacts);
      contactComponent.delete.emit('0');
      fixture.detectChanges();
      expect(modalService.closeModal).toHaveBeenCalledTimes(1);
    });
  });

  // closeDeleteConfirmation; tests
  describe('closeDeleteConfirmation', () => {
    beforeEach(() => {
      component.deleteId = '1';
      fixture.detectChanges();
    });

    it('closes modal when user clicks on backdrop', () => {
      const modalBackdrop = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
      modalBackdrop.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.deleteId).toEqual(null);
    });

    it('closes modal when user clicks on cancel button', () => {
      const modalCancelButton = fixture.debugElement.query(By.css('[data-testid=modalCancelButton]'));
      modalCancelButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.deleteId).toEqual(null);
    });

    it('doesnt close modal when user clicks on modal body', () => {
      const modal = fixture.debugElement.query(By.css('[data-testid=modal]'));
      modal.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.deleteId).toEqual('1');
    });
  });

  // deleteContact; tests
  describe('deleteContact', () => {
    it('deletes contact', () => {
      component.deleteId = '0';
      fixture.detectChanges();
      spyOn(contactsService, 'deleteContact').and.callFake((id: string) => {});
      const modalDeleteButton = fixture.debugElement.query(By.css('[data-testid=modalDeleteButton]'));
      modalDeleteButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(contactsService.deleteContact).toHaveBeenCalledWith('0');
    });

    it('doesnt delete contact if no id provided', () => {
      spyOn(contactsService, 'deleteContact').and.callFake((id: string) => {});
      const modalDeleteButton = fixture.debugElement.query(By.css('[data-testid=modalDeleteButton]'));
      modalDeleteButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(contactsService.deleteContact).toHaveBeenCalledTimes(0);
    });

    it('closes delete confirmation once contact deleted', () => {
      component.deleteId = '0';
      fixture.detectChanges();
      spyOn(contactsService, 'deleteContact').and.callFake((id: string) => {});
      const modalBackdrop = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
      const modalDeleteButton = fixture.debugElement.query(By.css('[data-testid=modalDeleteButton]'));
      modalDeleteButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(modalBackdrop.classes['open']).not.toBeDefined();
    });
  });

  // changePage; tests
  describe('changePage', () => {
    it('changes page', () => {
      spyOn(contactsService, 'changePage').and.callFake((page: number) => {});
      const paginationComponent = fixture.debugElement.query(By.css('[data-testid=pagination]')).componentInstance as PaginationComponentMock;
      paginationComponent.pageChanged.emit(5);
      expect(contactsService.changePage).toHaveBeenCalledTimes(1);
    });
  });

  // getContactsAmount; tests
  describe('getContactsAmount', () => {
    const contacts: IContact[] = [
      { id: '0', first_name: 'Aaron', last_name: 'Bravo', phone_number: '1' },
      { id: '1', first_name: 'Charlie', last_name: 'Sigma', phone_number: '1' },
    ];

    beforeEach(() => {
      contactsService.contacts$.next(contacts);
    });

    it('returns all contacts length', waitForAsync(() => {
      component.getContactsAmount().subscribe((amount: number) => {
        expect(amount).toEqual(2);
      });
    }));

    it('returns displayed contacts length if there is search value', waitForAsync(() => {
      contactsService.search$.next('aa');
      component.getContactsAmount().subscribe((amount: number) => {
        expect(amount).toEqual(1);
      });
    }));
  });

  // render; tests
  describe('render', () => {
    let contactComponent: ContactComponentMock;
    let paginationComponent: PaginationComponentMock;
    const contacts: IContact[] = [{ id: '0', first_name: 'Aaron', last_name: 'Bravo', phone_number: '1' }];

    beforeEach(() => {
      contactsService.contacts$.next(contacts);
      contactsService.currentPage$.next(1);
      contactsService.limitPerPage = 5;
      fixture.detectChanges();
      contactComponent = fixture.debugElement.query(By.css('[data-testid=contact]')).componentInstance as ContactComponentMock;
      paginationComponent = fixture.debugElement.query(By.css('[data-testid=pagination]')).componentInstance as PaginationComponentMock;
    });

    it('renders contact component with right values', () => {
      expect(contactComponent).toBeTruthy();
      expect(contactComponent.contactId).toEqual('0');
      expect(contactComponent.firstName).toEqual('Aaron');
      expect(contactComponent.lastName).toEqual('Bravo');
      expect(contactComponent.phoneNumber).toEqual('1');
    });

    it('renders pagination component with right values', () => {
      expect(paginationComponent).toBeTruthy();
      expect(paginationComponent.itemsAmount).toEqual(1);
      expect(paginationComponent.itemsPerPage).toEqual(5);
      expect(paginationComponent.currentPage).toEqual(1);
    });

    it('doesnt render contact component if no contacts provided', () => {
      contactsService.contacts$.next([]);
      fixture.detectChanges();
      contactComponent = fixture.debugElement.query(By.css('[data-testid=contact]'))?.componentInstance as ContactComponentMock;
      const message = fixture.debugElement.query(By.css('[data-testid=errorMessage]'));
      expect(contactComponent).not.toBeDefined();
      expect(message).toBeTruthy();
    });
  });
});
