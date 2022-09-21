import { Injectable } from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {Beer} from "../interfaces/beer.interface";
import {ApiService} from "./api.service";
import {map} from "rxjs/operators";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ErrorModalContentComponent} from "../shared/error-modal-content/error-modal-content.component";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private beersSubject$ = new BehaviorSubject<Beer[]>([]);
  private beersObs$ = this.beersSubject$.asObservable();

  private isShowSpinnerSubject$ = new BehaviorSubject<boolean>(false);
  private isShowSpinnerObs$ = this.isShowSpinnerSubject$.asObservable();

  private searchTextSubject$ = new BehaviorSubject<string>('');
  private searchTextObs$ = this.searchTextSubject$.asObservable();

  private pagingSubject$ = new BehaviorSubject<number>(1);
  private pagingObs$ = this.pagingSubject$.asObservable();

  private favoriteBeersSubject$ = new BehaviorSubject<Beer[]>([]);
  private favoriteBeersObs$ = this.favoriteBeersSubject$.asObservable();

  private totalFavoriteItems!: number;
  alertModalRef!:NgbModalRef;

  constructor(private apiService: ApiService, private modalService: NgbModal) { }

  setBeersByPageNumberAndFilterTextFromApi(pageNumber: number, perPage: number, filterTxt: string = '') {
    /** check for favorites in local storage **/
    const favoriteBeersStorage = this.apiService.getItemsFromLocalStorage('favoriteBeers');
    /** get items list by current page number and items a page and filter text **/
    this.apiService.getItemsByPageNumberAndFilterText(pageNumber, perPage, filterTxt)
      .pipe(
        map(beers => beers.map((beer: Beer) => {
          /** if favorites exists and it is the same id we manipulate is favorite to true else false **/
          if(favoriteBeersStorage && favoriteBeersStorage.find((favoriteBeer: Beer) => favoriteBeer.id === beer.id)) {
            return {...beer, isFavorite: true}
          } else {
            return {...beer, isFavorite: false}
          }
        }))
       ).subscribe({
      next: (beers: Beer[]) => {
        /** set the items in the subject **/
        this.beersSubject$.next(beers)
      }, error: (err) => {
        this.alertModalRef = this.modalService.open(ErrorModalContentComponent);
        this.alertModalRef.componentInstance.beer = err;
      }
    })
  }

  getBeersByPageNumFromLocalData() {
    return this.beersObs$;
  }

  setSearchText(searchTxt: string) {
    this.searchTextSubject$.next(searchTxt);
    this.searchTextObs$.subscribe((searchTxt: string) => {
      this.setBeersByPageNumberAndFilterTextFromApi(1, 12, searchTxt);
    })
  }

  getSearchText() {
    return this.searchTextObs$;
  }

  setPaging(pagingNum: number) {
    this.pagingSubject$.next(pagingNum);
  }

  getPaging() {
    return this.pagingObs$;
  }

  setSpinnerMode(isShowSpinner: boolean) {
    this.isShowSpinnerSubject$.next(isShowSpinner);
  }

  isShowSpinner() {
    return this.isShowSpinnerObs$;
  }

  setFavoriteBeersInLocalStorage(key: string, favoriteBeers: Beer[]) {
    this.apiService.setItemsInLocalStorage(key, favoriteBeers);
  }

  setTotalFavoriteItems(totalFavoriteItems: number) {
    this.totalFavoriteItems = totalFavoriteItems;
  }

  getTotalFavoriteItems() {
    return this.totalFavoriteItems;
  }

  setFavoriteBeersByPageNumber(key: string, pageNum: number, perPage: number) {
    /** get all favorites items from local storage storage **/
    const localStorageItemParsed = this.apiService.getItemsFromLocalStorage(key);
    /** set the total number of favorites items **/
    this.setTotalFavoriteItems(localStorageItemParsed.length);
    /** slice the favorites items by page and number of items per page **/
    let localStorageItemsCalculate: Beer[];
    if(localStorageItemParsed) {
      /**
       *  (1 - 1) * (12 - 1) = 0
       *  (2 - 1) * (12 - 1) = 11
       *  (3 - 1) * (12 - 1) = 22
       * **/
      const start = (pageNum - 1) * (perPage - 1);
      const end = start + perPage;
      localStorageItemsCalculate = localStorageItemParsed.slice(start, end);
    } else {
      localStorageItemsCalculate =  [];
    }
    this.favoriteBeersSubject$.next(localStorageItemsCalculate);
  }

  getFavoriteBeersByPageNumber() {
    return this.favoriteBeersObs$;
  }
}
