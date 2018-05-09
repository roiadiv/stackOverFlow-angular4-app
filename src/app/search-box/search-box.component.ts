import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from '../services/apiHandler.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { FilterResultsService } from '../services/filterResults.service';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  color = 'accent';

  // ** query config
  readonly pageSize = 5;
  readonly siteName = "stackoverflow";

  // ** forms ctrl & releted 
  searchInputFormCtrl: FormControl = new FormControl(undefined, [Validators.required]);
  filterInputFormCtrl: FormControl = new FormControl(undefined, [Validators.required]);
  filterSliderFormCtrl: FormControl = new FormControl();
  filterBtnState: boolean; // bind to the state of the filter button


  // ** events subs
  onGetResuletSubscription: Subscription;

  constructor(private apiHandlerService: ApiHandlerService,
    private filterResultsService: FilterResultsService) { }

  ngOnInit() {
    // init form config // disabling all filter related elements 
    this.filterInputFormCtrl.disable();
    this.filterSliderFormCtrl.disable();
    this.filterBtnState = false;

    // listening to the results returning from the server // from apiHandlerService
    this.onGetResuletSubscription = this.apiHandlerService.onGetResulet
      .subscribe((res) => {
        // allowing filter if query return any results 
        if (res.queryResult.length > 0) {
          this.filterSliderFormCtrl.enable();
        } else {
          this.filterSliderFormCtrl.disable();
        }

        // on every new search query setting all filter related elements to orginal state
        this.filterSliderFormCtrl.setValue(false);
        this.toggleFilterFileds(false);


      });
  }

  ngOnDestroy(): void {
    this.onGetResuletSubscription.unsubscribe();
  }

  // exec on click event of the search btn
  onSearchQuery() {
    if (this.searchInputFormCtrl.valid) {
      console.log(`onSearchQuery()`);
      let params = {
        site: this.siteName,
        order: 'desc',
        sort: 'votes',
        intitle: this.searchInputFormCtrl.value,
        filter: 'default',
        pagesize: this.pageSize,
        page: 1
      };
      this.apiHandlerService.onLaunchQuery(params);
    } else {
      console.log('Invalid input')
    }
  }

  // exec on click event of the filter btn
  onFilterClick() {
    console.log(`onFilterClick()`);
    if (this.searchInputFormCtrl.valid && this.filterInputFormCtrl.valid) {
      let filterText = this.filterInputFormCtrl.value;
      console.log(filterText);
      this.filterResultsService.onFilterResults.next(filterText);
    }
  }

  // is threr any results to display // user launch any query 
  isDisplayResults() :boolean {
    return this.apiHandlerService.displayResults();
  }

  // exec on change event of the slider
  onToggleFilterSilder(state: boolean) {
    this.filterResultsService.onToggleFilterState.next();
    this.toggleFilterFileds(state);
  }


  toggleFilterFileds(state: boolean) {
    if (state) {
      this.filterInputFormCtrl.enable()
    } else {
      this.filterInputFormCtrl.disable();
      this.filterInputFormCtrl.setValue('');
    }
    this.filterBtnState = state;
  }

}
