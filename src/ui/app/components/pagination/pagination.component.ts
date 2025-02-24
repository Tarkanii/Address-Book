import { NgClass } from '@angular/common';
import { Input, Component, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  imports: [NgClass]
})
export class PaginationComponent implements OnInit, OnChanges {
  // Input values
  @Input({ required: true }) public itemsAmount!: number | null;
  @Input({ required: true }) public itemsPerPage!: number;
  @Input() public currentPage: number = 1;
  @Output() public pageChanged: EventEmitter<number> = new EventEmitter();

  // Pages to be rendered
  public pages: number[] = [];

  public ngOnInit(): void {
    if (!this.itemsAmount)  {
      // Setting pages to an empty array as there are no items
      this.setPages(0, 1);
    } else {
      this.setPages(this.itemsAmount, this.itemsPerPage);
    }
  }

  public ngOnChanges({ itemsAmount }: SimpleChanges): void {
    if (!itemsAmount) return;
    this.setPages(itemsAmount.currentValue, this.itemsPerPage);
  }

  // Sets amount of pages
  private setPages(itemsAmount: number, itemsPerPage: number): void {
    this.pages = [...Array(Math.ceil(itemsAmount / itemsPerPage)).keys()].map((page: number) => page + 1);

    // If user deletes last contact on the page, we transfer him to the last available page
    if (this.currentPage > this.pages.length) {
      setTimeout(() => {
        // Prevents from wrong page change during async loading of saved contacts
        if (this.currentPage > this.pages.length) this.changePage(this.pages.length);
      });
    }
  }

  // Emmits event when user changes page
  public changePage(page: number): void {
    if (page <= 0 || page > this.pages.length) return;
    this.pageChanged.emit(page);
  }

}
