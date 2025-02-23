import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.itemsAmount = 50;
    component.itemsPerPage = 10;
    component.currentPage = 1;
    fixture.detectChanges();
  });

  // PaginationComponent; tests
  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('sets initial values', () => {
    expect(component.itemsAmount).toEqual(50);
    expect(component.itemsPerPage).toEqual(10);
    expect(component.currentPage).toEqual(1);
  });

  // ngOnInit; tests
  describe('ngOnInit', () => {
    it('sets pages correctly', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('sets pages to [] if there are no items', () => {
      component.itemsAmount = 0;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.pages).toEqual([]);
    });

    it('sets current page to last available if previous page was deleted', fakeAsync(() => {
      spyOn(component, 'changePage').and.callFake((page: number) => {});
      component.itemsAmount = 40;
      component.currentPage = 5;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
      tick(0);
      expect(component.changePage).toHaveBeenCalledWith(component.pages.length);
    }));
  });

  // ngOnChanges; tests
  describe('ngOnChanges', () => {
    it('sets pages correctly', () => {
      const simpleChange = { currentValue: 40, previousValue: 50, isFirstChange: () => false, firstChange: false };
      component.ngOnChanges({ itemsAmount: simpleChange });
      fixture.detectChanges();
      expect(component.pages).toEqual([1, 2, 3, 4]);
    });

    it('sets pages to [] if there are no items', () => {
      const simpleChange = { currentValue: 0, previousValue: 50, isFirstChange: () => false, firstChange: false };
      component.ngOnChanges({ itemsAmount: simpleChange });
      fixture.detectChanges();
      expect(component.pages).toEqual([]);
    });

    it('sets current page to last available if previous page was deleted', fakeAsync(() => {
      spyOn(component, 'changePage').and.callFake((page: number) => {});
      const simpleChange = { currentValue: 40, previousValue: 50, isFirstChange: () => false, firstChange: false };
      component.currentPage = 5;
      component.ngOnChanges({ itemsAmount: simpleChange });
      fixture.detectChanges();
      tick(0);
      expect(component.changePage).toHaveBeenCalledWith(component.pages.length);
    }));
  });

  // changePage; tests
  describe('changePage', () => {
    it('changes page', () => {
      spyOn(component.pageChanged, 'emit');
      component.changePage(2);
      expect(component.pageChanged.emit).toHaveBeenCalledWith(2);
    });

    it('doesnt change page if provided value <= 0', () => {
      spyOn(component.pageChanged, 'emit');
      component.changePage(0);
      expect(component.pageChanged.emit).toHaveBeenCalledTimes(0);
    });

    it('doesnt change page if provided value > pages.length', () => {
      spyOn(component.pageChanged, 'emit');
      component.changePage(6);
      expect(component.pageChanged.emit).toHaveBeenCalledTimes(0);
    });
  });

  // render: tests
  describe('render', () => {
    it('renders pagination list if there pages', () => {
      const paginationList = fixture.debugElement.query(By.css('[data-testid=paginationList]'));
      expect(paginationList).toBeTruthy();
    });

    it('doesnt render pagination list if there no pages', () => {
      component.itemsAmount = 0;
      component.ngOnInit();
      fixture.detectChanges();
      const paginationList = fixture.debugElement.query(By.css('[data-testid=paginationList]'));
      expect(paginationList).toBeFalsy();
    });

    it('renders correct amount of buttons', () => {
      const paginationButtons = fixture.debugElement.queryAll(By.css('[data-testid=paginationButton]'));
      expect(paginationButtons.length).toEqual(5);
    });

    it('highlights selected button', () => {
      const paginationButtons = fixture.debugElement.queryAll(By.css('[data-testid=paginationButton]'));
      expect(paginationButtons[0].classes['selected']).toEqual(true);
      component.currentPage = 4;
      fixture.detectChanges();
      expect(paginationButtons[3].classes['selected']).toEqual(true);
    });
  });

});
