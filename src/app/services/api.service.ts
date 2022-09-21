import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Beer} from "../interfaces/beer.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getItemsByPageNumberAndFilterText(pageNumber: number, perPage: number = 12, filterText = '' ): Observable<Beer[]> {
    if(filterText.length) {
      return this.httpClient.get<Beer[]>(`${environment.baseUrl}?page=${pageNumber}&per_page=${perPage}&food=${filterText}`);
    } else {
      return this.httpClient.get<Beer[]>(`${environment.baseUrl}?page=${pageNumber}&per_page=${perPage}`);
    }
  }

  setItemsInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItemsFromLocalStorage(key: string) {
    const localStorageItem = localStorage.getItem(key)
    if(localStorageItem) {
      return JSON.parse(localStorageItem);
    } else {
      return [];
    }

  }

}
