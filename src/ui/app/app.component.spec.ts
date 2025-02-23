import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ContactListComponent } from "./components/contact-list/contact-list.component";
import { ModalComponent } from "./components/modal/modal.component";
import { HeaderComponent } from "./components/header/header.component";
import { ModalService } from "./shared/services/modal.service";
import { AddFormComponent } from "./shared/forms/add-form/add-form.component";

@Component({ selector: 'app-header' }) class HeaderComponentMock {}

@Component({ selector: 'app-contact-list' }) class ContactListComponentMock {}

@Component({ selector: 'app-add-form' }) class AddFormComponentMock {}

@Component({ selector: 'app-modal', template: `<ng-content></ng-content>` }) class ModalComponentMock {
  @Input({ required: true }) public isOpen!: boolean;
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({}).overrideComponent(AppComponent, {
      remove: { imports: [HeaderComponent, ContactListComponent, ModalComponent, AddFormComponent] },
      add: { imports: [HeaderComponentMock, ContactListComponentMock, ModalComponentMock, AddFormComponentMock] }
    }).compileComponents();


    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  // AppComponent; tests
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  // render; tests
  describe('render', () => {

    it('renders header', () => {
      const header = fixture.debugElement.query(By.css('[data-testid=header]'));
      expect(header).toBeTruthy();
    });

    it('renders contact list', () => {
      const contactList = fixture.debugElement.query(By.css('[data-testid=contactList]'));
      expect(contactList).toBeTruthy();
    });

    it('renders modal with right values', () => {
      const modal = fixture.debugElement.query(By.css('[data-testid=modal]')).componentInstance as ModalComponentMock;
      expect(modal).toBeTruthy();
      expect(modal.isOpen).toEqual(false);
      component.currentModal$.next('add-form');
      fixture.detectChanges();
      expect(modal.isOpen).toEqual(true);
    });

    it('renders add form if currentModal="add-form"', () => {
      component.currentModal$.next('add-form');
      fixture.detectChanges();
      const addForm = fixture.debugElement.query(By.css('[data-testid=addForm]'));
      expect(addForm).toBeTruthy();
    });

    it('doesnt render add-form if currentModal="null"', () => {
      const addForm = fixture.debugElement.query(By.css('[data-testid=addForm]'));
      expect(addForm).toBeFalsy();
    });

  });

});