import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PageInfo} from "../../interfaces/page-info.interface";
import {StateService} from "../../services/state.service";
import {Beer} from "../../interfaces/beer.interface";
import {last, map} from 'rxjs/operators';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BeerModalContentComponent} from "../../shared/beer-modal-content/beer-modal-content.component";
import {LoadingModalContentComponent} from "../../shared/loading-modal-content/loading-modal-content.component";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";

@Component({
  selector: 'app-beers-page',
  templateUrl: './beers-page.component.html',
  styleUrls: ['./beers-page.component.scss']
})
export class BeersPageComponent implements OnInit {

  pageInfo!: PageInfo;
  beers: Beer[] = [];
  favoriteBeers: Beer[] = [];
  beerList: Beer[] = [];
  isShowSpinner: boolean = false;
  paginatorCurrentPage: number = 1;
  paginatorPageSize: number =  12;
  paginatorCollectionSize: number =  100;
  searchText: string = '';
  pageId: string = '';
  loadingModalRef!:NgbModalRef;
  alertModalRef!:NgbModalRef;
  constructor(private route: ActivatedRoute, private stateService: StateService, private modalService: NgbModal) { }

  ngOnInit(): void {

    /** catch spinner status **/
    this.stateService.isShowSpinner()
      .subscribe((isShowSpinner) =>  {
        if(isShowSpinner) {
         this.loadingModalRef = this.modalService.open(LoadingModalContentComponent);
        } else {
          this.loadingModalRef && this.loadingModalRef.close(LoadingModalContentComponent);
        }

      });

    /** catch routing page id  **/
    this.route.data.subscribe((data: any) => {
      /** reset current list of beers **/
      this.beerList = [];
      /** set page id **/
      this.pageId = data.pageId;
      /** reset paging **/
      this.stateService.setPaging(1);
      /** set the specific page browsing or favorite **/
      this.setPageType(data);
    });

    /** retrieve beers list after it been set from api **/
    this.stateService.getBeersByPageNumFromLocalData()
      .subscribe((beers: Beer[]) => {
        this.beers = [...beers];
        this.beerList = this.beers;
        this.paginatorCollectionSize = 100;
        /** disable loading **/
        this.stateService.setSpinnerMode(false);
      });

     /** retrieve favorite beers calculate by page number **/
     this.stateService.getFavoriteBeersByPageNumber()
      .subscribe((favoriteBeers: Beer[]) => {
          this.favoriteBeers = favoriteBeers.length? [...favoriteBeers]: [];
          this.paginatorCollectionSize = this.stateService.getTotalFavoriteItems();
          this.beerList = [...this.favoriteBeers];
          /** disable loading **/
          this.stateService.setSpinnerMode(false);
      });

    /** card list paging change **/
    this.stateService.getPaging()
      .subscribe((pagingNum: number) => {
        this.paginatorCurrentPage = pagingNum;
      });

    /** get search value **/
    this.stateService.getSearchText()
      .subscribe((searchTxt: string) => {
        this.searchText = searchTxt;
      });
  }

  setPageType(data: any) {
    /** BROWSE BEERS PAGE **/
    if (data.pageId === 'browse-beers') {
      /** show spinner **/
      this.stateService.setSpinnerMode(true);
      /** get the first beer list page 1 12 items with no filter **/
      this.stateService.setBeersByPageNumberAndFilterTextFromApi(1, 12, '');
      /** setting browse-beers page configuration **/
      this.pageInfo = {
        id:'browse-beers',
        name: 'browse-beers',
        title: 'Beers Catalog',
        description: 'please choose from our beer catalog your favorite beer, you can also filter by food pair to get your exact beer for the exact food',
        image_url: '',
        isSearch: true,
        isShowRank: false,
      }
    }
    /** FAVORITE BEERS PAGE **/
    if (data.pageId === 'favorite-beers') {
      /** get favorite beers for favorites page **/
      this.stateService.setFavoriteBeersByPageNumber('favoriteBeers', this.paginatorCurrentPage, this.paginatorPageSize);
      /** enable loading **/
      this.stateService.setSpinnerMode(true);
      /** setting favorite-beers page configuration **/
      this.pageInfo = {
        id: 'favorite-beers',
        name: 'favorite-beers',
        title: 'Favorites Beers',
        description: 'all your favorites beers are ready for taste and then you can rank them from 1-5 ',
        image_url: '',
        isSearch: false,
        isShowRank: true,
      }
    }
  }

  onSearchButtonClicked(searchStr: string) {
    this.stateService.setPaging(1);
    this.stateService.setSearchText(searchStr);
  }

  onPagingChange(pageNumber: number) {
    this.stateService.setPaging(pageNumber);
    /** if: browse-beers get the beers from api and set it to local
     * else: get favorite beers from localStorage manipulate the data by page and set it in local
     * **/
    /** enable loading **/
    this.stateService.setSpinnerMode(true);
    if(this.pageId === 'browse-beers') {
      this.stateService.setBeersByPageNumberAndFilterTextFromApi(pageNumber, 12, this.searchText);
    } else {
      this.stateService.setFavoriteBeersByPageNumber('favoriteBeers', pageNumber, this.paginatorPageSize)
    }
  }

  /** when user click on details button **/
  onShowCardDetails(card: Beer) {
    const modalRef = this.modalService.open(BeerModalContentComponent);
    modalRef.componentInstance.beer = card;
  }

  /** when user click favorite button**/
  toggleFavoriteBeer(beer: Beer) {
    /** if: it was already favorite we will remove favorite
     *  else: if it wasn't favorite we will set it to favorite
     * **/
    if(beer.isFavorite) {
      this.favoriteBeers = this.favoriteBeers.filter((favoriteBeer: Beer) => {
        return favoriteBeer.isFavorite !== beer.isFavorite;
      });
    } else {
      this.favoriteBeers.push(beer);
    }
    /** update the favorites changes in the view **/
    const changedBeer = this.beerList.find((beerFromList) => beerFromList.id === beer.id );
    if(changedBeer) {
      changedBeer.isFavorite = !beer.isFavorite;
    }
    /** set the new favorite items array in local storage **/
    this.stateService.setFavoriteBeersInLocalStorage('favoriteBeers',this.favoriteBeers);
  }

  /** when user rank beer in favorites page **/
  onRateBeer(beer:Beer) {
    /** update the favorites changes in the view **/
    const changedFavoriteBeer = this.favoriteBeers.find((beerFromList) => beerFromList.id === beer.id );
    if(changedFavoriteBeer) {
      changedFavoriteBeer.rank = beer.rank;
    }
    this.stateService.setFavoriteBeersInLocalStorage('favoriteBeers',this.favoriteBeers);
  }
}
