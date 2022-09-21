import {Component, Input, OnInit} from '@angular/core';
import {Beer} from "../../interfaces/beer.interface";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-beer-modal-content',
  templateUrl: './beer-modal-content.component.html',
  styleUrls: ['./beer-modal-content.component.scss']
})
export class BeerModalContentComponent implements OnInit {

  @Input() beer!: Beer;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.beer.name);
  }

}
