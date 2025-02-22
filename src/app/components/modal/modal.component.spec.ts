import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';
import { ModalService } from '../../shared/services/modal.service';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    modalService = TestBed.inject(ModalService);
    component = fixture.componentInstance;
    component.isOpen = true;
    fixture.detectChanges();
  });

  // ModalComponent; tests
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('shows modal if isOpen = "true"', () => {
    const modal = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
    expect(modal.classes['open']).toEqual(true);
  });

  it('doesnt show modal if isOpen = "false"', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
    expect(modal.classes['open']).not.toBeDefined();
  });

  // closeModal
  describe('closeModal', () => {
    it('closes modal if user clicked on backdrop', () => {
      spyOn(modalService, 'closeModal').and.callFake(() => {});
      const modalBackdrop = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
      (modalBackdrop.nativeElement as HTMLDivElement).dispatchEvent(new MouseEvent('click'));
      expect(modalService.closeModal).toHaveBeenCalledTimes(1);
    });

    it('closes modal if user clicked on close button', () => {
      spyOn(modalService, 'closeModal').and.callFake(() => {});
      const closeButton = fixture.debugElement.query(By.css('[data-testid=modalCloseButton]'));
      (closeButton.nativeElement as HTMLButtonElement).dispatchEvent(new MouseEvent('click'));
      expect(modalService.closeModal).toHaveBeenCalledTimes(1);
    });

    it('doesnt close modal if user clicked on modal body', () => {
      spyOn(modalService, 'closeModal').and.callFake(() => {});
      const modal = fixture.debugElement.query(By.css('[data-testid=modal]'));
      (modal.nativeElement as HTMLDivElement).dispatchEvent(new MouseEvent('click'));
      expect(modalService.closeModal).toHaveBeenCalledTimes(0);
    });

    it('gets called when user clicks on backdrop', () => {
      spyOn(component, 'closeModal').and.callFake((e?: MouseEvent) => {});
      const modalBackdrop = fixture.debugElement.query(By.css('[data-testid=modalBackdrop]'));
      (modalBackdrop.nativeElement as HTMLDivElement).dispatchEvent(new MouseEvent('click'));
      expect(component.closeModal).toHaveBeenCalledWith(new MouseEvent('click'));
    });

    it('gets called when user clicks on close button', () => {
      spyOn(component, 'closeModal').and.callFake((e?: MouseEvent) => {});
      const closeButton = fixture.debugElement.query(By.css('[data-testid=modalCloseButton]'));
      (closeButton.nativeElement as HTMLButtonElement).dispatchEvent(new MouseEvent('click'));
      expect(component.closeModal).toHaveBeenCalledWith();
    });
  });
});
