import { Component } from '@angular/core';
import { ContactsService } from '../../shared/services/contacts.service';
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
  public onInputChange(e: KeyboardEvent): void {
    const value = (e.target as HTMLInputElement).value;
    if (this.contactsService.search$.value === value) return;
    
    this.contactsService.changePage(1);
    this.contactsService.search$.next(value);
  }

  // Changes sorting value
  public onSortingChange(e: Event): void {
    this.contactsService.changePage(1);
    this.contactsService.sorting$.next((e.target as HTMLSelectElement).value);
  }

}
