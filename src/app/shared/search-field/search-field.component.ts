import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {
  @Output() onSearchButtonClicked = new EventEmitter<string>();
  searchValue: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSearch() {
    this.onSearchButtonClicked.emit(this.searchValue);
  }

}
