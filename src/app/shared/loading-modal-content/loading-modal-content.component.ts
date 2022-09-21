import {Component, Input, OnInit} from '@angular/core';
import {Beer} from "../../interfaces/beer.interface";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-loading-modal-content',
  templateUrl: './loading-modal-content.component.html',
  styleUrls: ['./loading-modal-content.component.scss']
})
export class LoadingModalContentComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
