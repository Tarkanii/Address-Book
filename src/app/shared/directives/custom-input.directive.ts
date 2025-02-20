import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective {

  @Input() public phone: boolean = false;

  constructor(
    private element: ElementRef<HTMLInputElement>,
    private ngControl: NgControl
  ) { }

  // Removes unnecessary whitespaces when user leaves form input
  @HostListener('blur') public onInputBlur(): void {
    this.trimControlValue();
  }

  // Removes unnecessary whitespaces when user hits 'Enter'
  @HostListener('keyup.enter') public onEnter(): void {
    this.trimControlValue();
  }

  // Removes unnecessary whitespaces
  public trimControlValue(): void {
    if (this.phone) {
      this.ngControl.control?.setValue(this.element.nativeElement.value.replace(/[\s]/g, ''));
      return;
    };
    
    this.ngControl.control?.setValue(this.element.nativeElement.value.trim());
  }

}
