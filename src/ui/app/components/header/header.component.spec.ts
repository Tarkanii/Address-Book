import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';
import { ContactsService } from '../../shared/services/contacts.service';
import { SortingEnum } from '../../shared/types/sorting.enum';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let contactsService: ContactsService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    contactsService = TestBed.inject(ContactsService);
    fixture.detectChanges();
  });

  // HeaderComponent; tests
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('sets initial values', () => {
    expect(component.sortingOptions).toEqual(Object.values(SortingEnum));
  });

  // onInputChange; tests
  describe('onInputChange', () => {
    it('passes search value to contactsService and changes page to 1', () => {
      spyOn(contactsService.search$, 'next').and.callFake((value: string) => {});
      spyOn(contactsService, 'changePage').and.callFake((page: number) => {});
      const input = fixture.debugElement.query(By.css('[data-testid=searchInput]'));
      input.nativeElement.value = 'J';
      input.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(contactsService.search$.next).toHaveBeenCalledWith('J');
      expect(contactsService.changePage).toHaveBeenCalledWith(1);
    });

    it('doesnt pass search value to contactsService if search is the same', () => {
      contactsService.search$.next('J');
      spyOn(contactsService.search$, 'next').and.callFake((value: string) => {});
      spyOn(contactsService, 'changePage').and.callFake((page: number) => {});
      const input = fixture.debugElement.query(By.css('[data-testid=searchInput]'));
      input.nativeElement.value = 'J';
      input.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(contactsService.search$.next).toHaveBeenCalledTimes(0);
      expect(contactsService.changePage).toHaveBeenCalledTimes(0);
    });
  });

  // onSortingChange; tests
  describe('onSortingChange', () => {
    it('passes sorting value to contactsService and changes page to 1', () => {
      spyOn(contactsService.sorting$, 'next').and.callFake((value: string) => {});
      spyOn(contactsService, 'changePage').and.callFake((page: number) => {});
      const select = fixture.debugElement.query(By.css('[data-testid=searchSelect]'));
      select.nativeElement.value = SortingEnum.firstName;
      select.nativeElement.dispatchEvent(new Event('change'));
      expect(contactsService.sorting$.next).toHaveBeenCalledWith(SortingEnum.firstName);
      expect(contactsService.changePage).toHaveBeenCalledWith(1);
    });
  });

  // render; tests
  describe('render', () => {
    it('renders search input and select', () => {
      const searchInput = fixture.debugElement.query(By.css('[data-testid=searchInput]'));
      const searchSelect = fixture.debugElement.query(By.css('[data-testid=searchSelect]'));
      expect(searchInput).toBeTruthy();
      expect(searchSelect).toBeTruthy();
    });

    it('renders select options', () => {
      const selectOptions = fixture.debugElement.queryAll(By.css('[data-testid=searchSelectOption]'));
      selectOptions.forEach((option: DebugElement) => {
        expect(option).toBeTruthy();
        expect(Object.values(SortingEnum).includes(option.nativeElement.value)).toEqual(true);
      });
    });
  });
});
