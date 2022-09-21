import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-modal-content',
  templateUrl: './error-modal-content.component.html',
  styleUrls: ['./error-modal-content.component.scss']
})
export class ErrorModalContentComponent implements OnInit {
  @Input() errorMsg = ''
  constructor() { }

  ngOnInit(): void {
  }

}
