import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AddFormComponent } from './add-form.component';
import { FormsService } from '../../services/forms.service';
import { ContactsService } from '../../services/contacts.service';
import { ModalService } from '../../services/modal.service';
import { IContactFormValue } from '../../types/contact';

describe('AddFormComponent', () => {
  let component: AddFormComponent;
  let fixture: ComponentFixture<AddFormComponent>;
  let formsService: FormsService;
  let modalService: ModalService;
  let contactsService: ContactsService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormComponent);
    component = fixture.componentInstance;
    formsService = TestBed.inject(FormsService);
    modalService = TestBed.inject(ModalService);
    contactsService = TestBed.inject(ContactsService);
    fixture.detectChanges();
  });

  // addFormComponent; tests
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('initiates a formGroup', () => {
    expect(component.addContactForm).toBeTruthy();
    expect(component.addContactForm.value).toEqual({ firstName: '', lastName: '', phoneNumber: '' });
  });

  // render; tests
  describe('render', () => {
    it('renders form inputs', () => {
      const firstNameInput = fixture.debugElement.query(By.css('[formControlName=firstName]'));
      const lastNameInput = fixture.debugElement.query(By.css('[formControlName=lastName]'));
      const phoneNumberInput = fixture.debugElement.query(By.css('[formControlName=phoneNumber]'));
      expect(firstNameInput).toBeTruthy();
      expect(lastNameInput).toBeTruthy();
      expect(phoneNumberInput).toBeTruthy();
    });

    it('highlights invalid inputs, labels and hints with error color', () => {

      const formLabelsStyles = fixture.debugElement.queryAll(By.css('[data-testid=formLabel]')).map(({ nativeElement }: DebugElement) => {
        return getComputedStyle(nativeElement);
      });

      const formInputsStyles = fixture.debugElement.queryAll(By.css('[data-testid=formInput]')).map(({ nativeElement }: DebugElement) => {
        return getComputedStyle(nativeElement);
      });

      const formHintsStyles = fixture.debugElement.queryAll(By.css('[data-testid=formHint]')).map(({ nativeElement }: DebugElement) => {
        return getComputedStyle(nativeElement);
      });

      component.addContactForm.controls['phoneNumber'].setValue('..');
      component.addContactForm.markAllAsTouched();
      fixture.detectChanges();
      
      const errorColor = formInputsStyles[0].getPropertyValue('--error-color');

      formLabelsStyles.forEach((labelStyles: CSSStyleDeclaration) => {
        expect(labelStyles.color).toEqual(errorColor);
      });

      formInputsStyles.forEach((inputStyles: CSSStyleDeclaration) => {
        expect(inputStyles.borderColor).toEqual(errorColor);
      });

      formHintsStyles.forEach((hintStyles: CSSStyleDeclaration) => {
        expect(hintStyles.opacity).toEqual('1');
        expect(hintStyles.visibility).toEqual('visible');
        expect(hintStyles.color).toEqual(errorColor);
      });
    });
  });

  // addContact; tests
  describe('addContact', () => {
    it('marks form as touched', () => {
      component.addContact();
      fixture.detectChanges();
      expect(component.addContactForm.touched).toEqual(true);
    });

    it('validates form', () => {
      component.addContact();
      fixture.detectChanges();
      expect(component.addContactForm.valid).toEqual(false);
    });

    it('doesnt add contact if form is invalid', () => {
      spyOn(contactsService, 'addContact').and.callFake((value: IContactFormValue) => {});
      component.addContact();
      fixture.detectChanges();
      expect(component.addContactForm.valid).toEqual(false);
      expect(contactsService.addContact).toHaveBeenCalledTimes(0);
    });

    it('adds contact if form is valid', () => {
      const formValue = { firstName: 'aa', lastName: 'bb', phoneNumber: '+447700000000' };
      spyOn(contactsService, 'addContact').and.callFake((value: IContactFormValue) => {});
      spyOn(modalService, 'closeModal').and.callFake(() => {});
      component.addContactForm.setValue(formValue);
      component.addContact();
      fixture.detectChanges();
      expect(component.addContactForm.valid).toEqual(true);
      expect(contactsService.addContact).toHaveBeenCalledWith(formValue);
    });

    it('closes modal once contact is added', () => {
      const formValue = { firstName: 'aa', lastName: 'bb', phoneNumber: '+447700000000' };
      spyOn(contactsService, 'addContact').and.callFake((value: IContactFormValue) => {});
      spyOn(modalService, 'closeModal').and.callFake(() => {});
      component.addContactForm.setValue(formValue);
      component.addContact();
      fixture.detectChanges();
      expect(modalService.closeModal).toHaveBeenCalledTimes(1);
    });
  });
});
