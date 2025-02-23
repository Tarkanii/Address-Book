import { TestBed } from "@angular/core/testing"
import { ModalService } from "./modal.service";

describe('ModalService', () => {
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    modalService = TestBed.inject(ModalService);
  });

  // modalService; tests
  it('creates a service', () => {
    expect(modalService).toBeTruthy();
  });

  it('sets initial value', () => {
    expect(modalService.currentModal$.value).toEqual(null);
  });

  // openModal; tests
  describe('openModal', () => {
    it('opens modal', () => {
      modalService.openModal('add-form');
      expect(modalService.currentModal$.value).toEqual('add-form');
    });
  });

  // closeModal; tests
  describe('closeModal', () => {
    it('closes modal', () => {
      modalService.currentModal$.next('add-form');
      modalService.closeModal();
      expect(modalService.currentModal$.value).toEqual(null);
    });
  });
});