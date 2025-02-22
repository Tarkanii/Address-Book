import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  // Regular expression for UK phone numbers
  public phoneNumberRegExp: RegExp = new RegExp(/((([+]44)(?=(7[0-9]))){0,1}(0{0,1}7[0-9]))\d{7,8}/g);

  // Validator function for phone numbers
  public phoneValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      const match = (control.value as string).match(this.phoneNumberRegExp);
      if (!match) return { error: true, message: 'Valid phone number: +447x12345678 or 07x12345678' };

      if (match[0] === control.value) return null;

      return { error: true, message: 'Valid phone number: +447x12345678 or 07x12345678' };
    }
  }
}