import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatButtonModule, 
  MatInputModule,
  MatListModule,
  MatChipsModule,
  MatToolbarModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatCardModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { ApiHandlerService } from './services/apiHandler.service';
import { ResultsBoxComponent } from './results-box/results-box.component';
import { FilterResultsService } from './services/filterResults.service';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    ResultsBoxComponent,
    UserQuestionsComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatChipsModule,
    MatToolbarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCardModule
  ],
  providers: [ApiHandlerService, FilterResultsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
