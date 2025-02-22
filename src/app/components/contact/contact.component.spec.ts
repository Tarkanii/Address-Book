import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    component.contactId = '0';
    component.firstName = 'aa';
    component.lastName = 'aa';
    component.phoneNumber = '1';
    fixture.detectChanges();
  });

  // ContactComponent; tests 
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('sets intitial values', () => {
    expect(component.contactId).toEqual('0');
    expect(component.firstName).toEqual('aa');
    expect(component.lastName).toEqual('aa');
    expect(component.phoneNumber).toEqual('1');
  });

  it('renders values', () => {
    const name = fixture.debugElement.query(By.css('[data-testid=contactName]'));
    const phone = fixture.debugElement.query(By.css('[data-testid=contactPhone]'));
    expect(name.nativeElement.textContent).toEqual('aa aa');
    expect(phone.nativeElement.textContent).toEqual('1');
  });

  it('doesnt render phone if not provided', () => {
    component.phoneNumber = undefined;
    fixture.detectChanges();
    const phone = fixture.debugElement.query(By.css('[data-testid=contactPhone]'));
    expect(phone?.nativeElement).not.toBeDefined();
  });

  // deleteContact; tests
  describe('deleteContact', () => {
    it('deletes contact on button click', () => {
      spyOn(component.delete, 'emit').and.callFake((id: string) => {});
      const contactDeleteButton = fixture.debugElement.query(By.css('[data-testid=contactDeleteButton]'));
      contactDeleteButton.nativeElement.dispatchEvent(new MouseEvent('click'));
      expect(component.delete.emit).toHaveBeenCalledWith('0');
    });
  });
});
