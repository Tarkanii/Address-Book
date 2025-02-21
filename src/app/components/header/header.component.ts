import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ContactsService } from '../../shared/services/contacts.service';
import { fromEvent, map } from 'rxjs';
import { SortingEnum } from '../../shared/types/sorting.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Options for select element
  public sortingOptions: string[] = Object.values(SortingEnum);

  constructor(private contactsService: ContactsService) {}

  // Changes search value
  public onInputChange(e: Event): void {
    this.contactsService.search$.next((e.target as HTMLInputElement).value);
  }

  // Changes sorting value
  public onSortingChange(e: Event): void {
    this.contactsService.sorting$.next((e.target as HTMLSelectElement).value);
  }

}
