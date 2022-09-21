import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BeersPageComponent } from './pages/beers-page/beers-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SearchFieldComponent } from './shared/search-field/search-field.component';
import {FormsModule} from "@angular/forms";
import { BeerCardListComponent } from './shared/card-list/beer-card-list.component';
import {StateService} from "./services/state.service";
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {BeerCardComponent} from './shared/beer-card/beer-card.component';
import { ModalComponent } from './shared/modal/modal.component';
import { BeerModalContentComponent } from './shared/beer-modal-content/beer-modal-content.component';
import { LoadingModalContentComponent } from './shared/loading-modal-content/loading-modal-content.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorModalContentComponent } from './shared/error-modal-content/error-modal-content.component';

@NgModule({
  declarations: [
    AppComponent,
    BeersPageComponent,
    NotFoundPageComponent,
    SearchFieldComponent,
    BeerCardListComponent,
    BeerCardComponent,
    ModalComponent,
    BeerModalContentComponent,
    LoadingModalContentComponent,
    ErrorModalContentComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        FontAwesomeModule
    ],
  providers: [StateService, ApiService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
