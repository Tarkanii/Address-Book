import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomInputDirective } from './custom-input.directive';

// Component for testing
@Component({
  template: `
    <input appCustomInput data-testid='input' type='text' [formControl]="control" />
    <input appCustomInput data-testid='phoneInput' [phone]='true' type='text' [formControl]="phoneControl" />
  `,
  imports: [CustomInputDirective, ReactiveFormsModule]
})
class TestComponent {
  public control: FormControl = new FormControl('');
  public phoneControl: FormControl = new FormControl('');
}

describe('CustomInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomInputDirective, TestComponent, NgControl]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  // customInputDirective; tests
  it('creates an instance', () => {
    const inputElement = fixture.debugElement.query(By.css('[data-testid=input]')).nativeElement;
    const ngControl = fixture.debugElement.query(By.css('[data-testid=input]')).injector.get(NgControl);
    const directive = new CustomInputDirective(new ElementRef(inputElement), ngControl);
    expect(directive).toBeTruthy();
  });

  it('creates a test component', () => {
    expect(testComponent).toBeTruthy();
  });

  it('modifies value correctly with phone = "true" on blur', () => {
    const inputElement = fixture.debugElement.query(By.css('[data-testid=phoneInput]')).nativeElement as HTMLInputElement;
    const ngControl = fixture.debugElement.query(By.css('[data-testid=phoneInput]')).injector.get(NgControl);

    ngControl.control?.setValue('  23  32 3   ');
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(inputElement.value).toEqual('23323');
  });

  it('modifies value correctly with phone = "true" on "Enter"', () => {
    const inputElement = fixture.debugElement.query(By.css('[data-testid=phoneInput]')).nativeElement as HTMLInputElement;
    const ngControl = fixture.debugElement.query(By.css('[data-testid=phoneInput]')).injector.get(NgControl);
    
    ngControl.control?.setValue('  23  32 3   ');
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();
    expect(inputElement.value).toEqual('23323');
  });

  it('modifies value correctly with phone = "false" on blur', () => {
    const inputElement = fixture.debugElement.query(By.css('[data-testid=input]')).nativeElement as HTMLInputElement;
    const ngControl = fixture.debugElement.query(By.css('[data-testid=input]')).injector.get(NgControl);

    ngControl.control?.setValue('  Osaka  ');
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(inputElement.value).toEqual('Osaka');

    ngControl.control?.setValue('  Osa ka  ');
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(inputElement.value).toEqual('Osa ka');
  });

  it('modifies value correctly with phone = "false" on "Enter"', () => {
    const inputElement = fixture.debugElement.query(By.css('[data-testid=input]')).nativeElement as HTMLInputElement;
    const ngControl = fixture.debugElement.query(By.css('[data-testid=input]')).injector.get(NgControl);

    ngControl.control?.setValue('  Osaka  ');
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();
    expect(inputElement.value).toEqual('Osaka');

    ngControl.control?.setValue('  Osa ka  ');
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();
    expect(inputElement.value).toEqual('Osa ka');
  });
});
