import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Beer} from "../../interfaces/beer.interface";

@Component({
  selector: 'app-beer-card-list',
  templateUrl: './beer-card-list.component.html',
  styleUrls: ['./beer-card-list.component.scss']
})
export class BeerCardListComponent<T> implements OnInit {
  _beerCards: Beer[] = [];
  @Input() set beerCards(beerCards: Beer[]) {
    this._beerCards = beerCards;
    if(beerCards.length) {
      this.setChunkedArray();
    } else {
      this.chunkedCardsArray = [];
    }
  }

  get beerCards(): Beer[] {
    return this._beerCards
  }

  _paginatorCurrentPage: number = 1;
  @Input() set paginatorCurrentPage(paginatorCurrentPage: number) {
    this._paginatorCurrentPage = paginatorCurrentPage;
  }

  get paginatorCurrentPage(): number {
    return this._paginatorCurrentPage;
  }

  @Input() paginatorPageSize: number = 12;
  @Input() paginatorCollectionSize: number = 100;
  @Input() isShowRating: boolean = false;

  @Output() pagingChange = new EventEmitter<number>();
  @Output() showCardDetails = new EventEmitter<Beer>();
  @Output() toggleFavoriteCard = new EventEmitter<Beer>();
  @Output() rateCard = new EventEmitter<Beer>();

  chunkedCardsArray:Beer[][] = [];

  constructor() { }

  ngOnInit(): void {
  }

  setChunkedArray() {
    const perChunk = 4;
    this.chunkedCardsArray= this.beerCards.reduce((resultArray:Beer[][], item: Beer, index: number) => {
      const chunkIndex = Math.floor(index/perChunk)
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
  }

  onPagingChange(pagingNumber: number) {
    this.pagingChange.emit(pagingNumber);
  }

  onShowCardDetails(card: Beer) {
    this.showCardDetails.emit(card);
  }

  onToggleFavoriteCard(card: Beer) {
    this.toggleFavoriteCard.emit(card);
  }

  onRateCard(card: Beer) {
    this.rateCard.emit(card);
  }

}
