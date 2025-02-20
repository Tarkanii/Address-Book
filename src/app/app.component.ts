import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './shared/services/modal.service';
import { ModalType } from './shared/types/modal';
import { AddFormComponent } from './shared/forms/add-form/add-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [HeaderComponent, ContactListComponent, ModalComponent, AddFormComponent, AsyncPipe]
})
export class AppComponent {
  // If has value will display modal window with relevant form inside
  public currentModal$: BehaviorSubject<ModalType>;
  
  constructor(private modalService: ModalService) {
    this.currentModal$ = this.modalService.currentModal$;
  }

}
