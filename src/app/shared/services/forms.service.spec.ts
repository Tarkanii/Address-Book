import { TestBed } from "@angular/core/testing";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { FormsService } from "./forms.service";

describe('FormsService', () => {

  let formsService: FormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    formsService = TestBed.inject(FormsService);
  });

  // formsService; tests
  it('creates a service', () => {
    expect(formsService).toBeTruthy();
  });

  it('sets initial values', () => {
    expect(formsService.phoneNumberRegExp).toEqual(new RegExp(/((([+]44)(?=(7[0-9]))){0,1}(0{0,1}7[0-9]))\d{7,8}/g));
  });

  // phoneValidator; tests
  describe('phoneValidator', () => {
    let validatorFn: ValidatorFn;
    let errorObj = { error: true, message: 'Valid phone number: +447x12345678 or 07x12345678' };

    beforeEach(() => {
      validatorFn = formsService.phoneValidator();
    });

    it('doesnt return error if no value is provided', () => {
      const res = validatorFn({ value: null } as AbstractControl);
      expect(res).toEqual(null);
    });

    it('returns error if wrong value is provided', () => {
      let res = validatorFn({ value: 'null' } as AbstractControl);
      expect(res).toEqual(errorObj);
      res = validatorFn({ value: ' 4477 00 000 000' } as AbstractControl);
      expect(res).toEqual(errorObj);
    });

    it('returns error if multiple correct values are provided', () => {
      const res = validatorFn({ value: '+447700000000+447700000000+447700000000' } as AbstractControl);
      expect(res).toEqual(errorObj);
    });

    it('doesnt return error if correct value is provided', () => {
      let res = validatorFn({ value: '+447700000000' } as AbstractControl);
      expect(res).toEqual(null);
      res = validatorFn({ value: '+44770000000' } as AbstractControl);
      expect(res).toEqual(null);
      res = validatorFn({ value: '7700000000' } as AbstractControl);
      expect(res).toEqual(null);
      res = validatorFn({ value: '07700000000' } as AbstractControl);
      expect(res).toEqual(null);
      res = validatorFn({ value: '770000000' } as AbstractControl);
      expect(res).toEqual(null);
      res = validatorFn({ value: '0770000000' } as AbstractControl);
      expect(res).toEqual(null);
    });
  });
});