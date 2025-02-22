import { TestBed, waitForAsync } from "@angular/core/testing";
import { ContactsService } from "./contacts.service"
import { defaultContacts } from "../defaultValues/contacts";
import { SortingEnum } from "../types/sorting.enum";
import { IContact } from "../types/contact";

describe('ContactsService', () => {
  let contactsService: ContactsService;
  // Mocking localStorage
  let localStore: { [key: string]: string } = {};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    contactsService = TestBed.inject(ContactsService);
  });

  // contactsService; tests
  it('creates a service', () => {
    expect(contactsService).toBeTruthy();
  });

  it('sets initial values', () => {
    localStore['ab-ng-contacts'] = '[]';
    spyOn(window.localStorage, 'getItem').and.callFake(getItemFake);
    spyOn(window.localStorage, 'setItem').and.callFake(setItemFake);
    
    const service = new ContactsService();

    expect(service.contacts$.value).toEqual([]);
    expect(service.search$.value).toEqual('');
    expect(service.sorting$.value).toEqual(SortingEnum.default);
    expect(service.currentPage$.value).toEqual(1);
    expect(service.limitPerPage).toEqual(5);
  });

  // contructor; tests
  describe('contructor', () => {
    
    it('saves default contacts into the localStorage if nothing is saved there', () => {
      localStore = {};
      spyOn(window.localStorage, 'getItem').and.callFake(getItemFake);
      spyOn(window.localStorage, 'setItem').and.callFake(setItemFake);

      const service = new ContactsService();
      
      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('ab-ng-contacts', JSON.stringify(defaultContacts));
    });

    it('fills contacts with the contacts from localStorage if there some', () => {
      const contact: IContact = { id: '0', first_name: 'Jon', last_name: 'Johns' };

      spyOn(window.localStorage, 'getItem').and.callFake(getItemFake);
      spyOn(window.localStorage, 'setItem').and.callFake(setItemFake);

      localStore['ab-ng-contacts'] = JSON.stringify([contact]);
      const service = new ContactsService();

      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
      expect(service.contacts$.value).toEqual([contact]);

    });
    
  });

  // getContacts; tests
  describe('getContacts', () => {
    const testContacts: IContact[] = [
      { id: '0', first_name: 'Aaron', last_name: 'Colins' },
      { id: '1', first_name: 'Timothy', last_name: 'Jenkins' },
      { id: '2', first_name: 'Bob', last_name: 'Solo' },
    ]

    const testContactsSortedByFirstName: IContact[] = [
      { id: '0', first_name: 'Aaron', last_name: 'Colins' },
      { id: '2', first_name: 'Bob', last_name: 'Solo' },
      { id: '1', first_name: 'Timothy', last_name: 'Jenkins' },
    ]

    const testContactsSortedByLastName: IContact[] = [
      { id: '0', first_name: 'Aaron', last_name: 'Colins' },
      { id: '1', first_name: 'Timothy', last_name: 'Jenkins' },
      { id: '2', first_name: 'Bob', last_name: 'Solo' },
    ]

    beforeEach(() => {
      contactsService.contacts$.next(testContacts);
    });

    it('returns correct contacts with default values', waitForAsync(() => {
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual(testContacts);
      });
    }));

    it('returns correct contacts with firstName sorting', waitForAsync(() => {
      contactsService.sorting$.next(SortingEnum.firstName);
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual(testContactsSortedByFirstName);
      });
    }));

    it('returns correct contacts with lastName sorting', waitForAsync(() => {
      contactsService.sorting$.next(SortingEnum.lastName);
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual(testContactsSortedByLastName);
      });
    }));

    it('returns correct values with search value "o"', waitForAsync(() => {
      contactsService.search$.next('o');
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual([]);
      });
    }));

    it('returns correct values with search value "bo"', waitForAsync(() => {
      contactsService.search$.next('bo');
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual([{ id: '2', first_name: 'Bob', last_name: 'Solo' }]);
      });
    }));

    it('returns correct values with search value "JE"', waitForAsync(() => {
      contactsService.search$.next('JE');
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual([{ id: '1', first_name: 'Timothy', last_name: 'Jenkins' }]);
      });
    }));

    it('returns correct values with currentPage = 1', waitForAsync(() => {
      contactsService.limitPerPage = 1;
      contactsService.currentPage$.next(1);
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual([{ id: '0', first_name: 'Aaron', last_name: 'Colins' }]);
      });
    }));

    it('returns correct values with currentPage = 2', waitForAsync(() => {
      contactsService.limitPerPage = 1;
      contactsService.currentPage$.next(2);
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual([{ id: '1', first_name: 'Timothy', last_name: 'Jenkins' }]);
      });
    }));

    it('returns correct values with currentPage = 1, limitPerPage = 2', waitForAsync(() => {
      contactsService.limitPerPage = 2;
      contactsService.currentPage$.next(1);
      contactsService.getContacts().subscribe((contacts: IContact[]) => {
        expect(contacts).toEqual([
          { id: '0', first_name: 'Aaron', last_name: 'Colins' },
          { id: '1', first_name: 'Timothy', last_name: 'Jenkins' }
        ]);
      });
    }));
  });

  // addContact; tests
  describe('addContact', () => {
    it('adds a contact', () => {
      Math.random = () => 0;
      spyOn(window.localStorage, 'setItem').and.callFake(setItemFake);
      
      localStore['ab-ng-contacts'] = '[]';
      contactsService.contacts$.next([]);
      contactsService.addContact({ firstName: 'a', lastName: 'b', phoneNumber: '' });
      expect(contactsService.contacts$.value).toEqual([{ id: '0', first_name: 'a', last_name: 'b' }]);
      expect(localStore['ab-ng-contacts']).toEqual(JSON.stringify([{ id: '0', first_name: 'a', last_name: 'b' }]));

      localStore['ab-ng-contacts'] = '[]';
      contactsService.contacts$.next([]);
      contactsService.addContact({ firstName: 'a', lastName: 'b', phoneNumber: '11' });
      expect(contactsService.contacts$.value).toEqual([{ id: '0', first_name: 'a', last_name: 'b', phone_number: '11' }]);
      expect(localStore['ab-ng-contacts']).toEqual(JSON.stringify([{ id: '0', first_name: 'a', last_name: 'b', phone_number: '11' }]));
    });
  });

  // deleteContact; tests
  describe('deleteContact', () => {
    it('deletes contact', () => {
      const contact = { id: '0', first_name: 'Aaron', last_name: 'Colins' };
      contactsService.contacts$.next([contact]);
      localStore['ab-ng-contacts'] = JSON.stringify([contact]);
      spyOn(window.localStorage, 'setItem').and.callFake(setItemFake);

      contactsService.deleteContact('0');
      expect(contactsService.contacts$.value).toEqual([]);
      expect(localStore['ab-ng-contacts']).toEqual('[]');
    });
  });

  // changePage; tests
  describe('changPage', () => {
    it('sets the page', () => {
      contactsService.changePage(1);
      expect(contactsService.currentPage$.value).toEqual(1);
      contactsService.changePage(5);
      expect(contactsService.currentPage$.value).toEqual(5);
    });
  });

  function getItemFake(key: string): string | null {
    return localStore[key] ? localStore[key] : null;
  }

  function setItemFake(key: string, value: string): void {
    localStore[key] = value;
  }
});