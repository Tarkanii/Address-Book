import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModalType } from '../../shared/types/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Current open modal
  public currentModal$: BehaviorSubject<ModalType> = new BehaviorSubject<ModalType>(null);

  // Opens needed modal
  public openModal(modal: ModalType): void {
    this.currentModal$.next(modal);
  }

  // Closes modal
  public closeModal(): void {
    this.currentModal$.next(null);
  }

}