import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BeersPageComponent} from "./pages/beers-page/beers-page.component";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";

const routes: Routes = [
  { path: 'browse-beers', component: BeersPageComponent, data: {pageId: 'browse-beers'} },
  { path: 'favorite-beers', component: BeersPageComponent, data: {pageId: 'favorite-beers'} },
  { path: '',   redirectTo: 'browse-beers', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
