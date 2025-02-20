import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { ContactsService } from '../../services/contacts.service';
import { CustomInputDirective } from '../../directives/custom-input.directive';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-add-form',
  imports: [ReactiveFormsModule, CustomInputDirective],
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.scss'
})
export class AddFormComponent {
  // Form group for ading contact
  public addContactForm: FormGroup;

  constructor(
    private formService: FormsService, 
    private contactsService: ContactsService,
    private modalService: ModalService
  ) {
    // Initiates form group
    this.addContactForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', this.formService.phoneValidator()),
    });
  }

  // Adds contact if formGroup is valid and closes modal window
  public addContact(): void {
    this.addContactForm.markAllAsTouched();
    if (!this.addContactForm.valid) return;
    this.contactsService.addContact(this.addContactForm.value);
    this.modalService.closeModal();
  }

}
