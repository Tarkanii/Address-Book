import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  // Gets opened if modalService.currentModal$ has value
  @Input({ required: true }) public isOpen!: boolean;

  constructor(private modalService: ModalService) {}

  // Closes modal if user clicked on close button
  public closeModal(): void {
    this.modalService.closeModal();
  }

}
