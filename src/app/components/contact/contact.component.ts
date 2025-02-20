import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  // Contact info
  @Input({ required: true }) public contactId!: string;
  @Input({ required: true }) public firstName!: string;
  @Input({ required: true }) public lastName!: string;
  @Input({ required: true }) public phoneNumber!: string | undefined;

  // EventEmitter for confirmation window in parent component
  @Output() public delete: EventEmitter<string> = new EventEmitter();

  // Emitts contact Id for confirmation window
  public deleteContact(): void {
    this.delete.emit(this.contactId);
  }
}
