import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Beer} from "../../interfaces/beer.interface";
import { faCoffee, faBeer } from '@fortawesome/free-solid-svg-icons';

export interface Rate {
  value: number,
  text: string,
  iconUrl?: string
}

@Component({
  selector: 'app-beer-card',
  templateUrl: './beer-card.component.html',
  styleUrls: ['./beer-card.component.scss']
})

export class BeerCardComponent implements OnInit {
  @Input() card!: Beer
  @Input() isShowRating: boolean = false
  @Output() showCardDetails =  new EventEmitter<Beer>();
  @Output() toggleFavoriteCard =  new EventEmitter<Beer>();
  @Output() rateCard =  new EventEmitter<Beer>();
  ratings: Rate[] = [
    {value: 1, text: '1 star', iconUrl: '1-star-rating.svg'},
    {value: 2, text: '2 stars', iconUrl: '2-star-rating.svg'},
    {value: 3, text: '3 stars', iconUrl: '3-star-rating.svg'},
    {value: 4, text: '4 stars', iconUrl: '4-star-rating.svg'},
    {value: 5, text: '5 stars', iconUrl: '5-star-rating.svg'}
  ];
  faBeer = faBeer;
  dropDownSelection: Rate = {
    value: 0,
    text: 'Rate Your Beer!',
    iconUrl: ''
  }
  currentRateSelection: Rate = this.dropDownSelection;
  constructor() { }

  ngOnInit(): void {
    /** set rating **/
    if (this.card.rank) {
      const rate: Rate | undefined = this.ratings.find(rate => rate.value === this.card.rank);
      if(rate) {
        this.currentRateSelection = rate;
      }
    }
     else {
      this.currentRateSelection = this.dropDownSelection;
    }
  }

  onShowDetails() {
    this.showCardDetails.emit(this.card);
  }

  setIsFavorite(card: Beer) {
    this.toggleFavoriteCard.emit(card);
  }

  onRating(rateObj: Rate){
    this.currentRateSelection = rateObj;
    this.card.rank = rateObj.value;
    this.rateCard.emit(this.card);
  }


}
