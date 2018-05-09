import { Component, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { ApiHandlerService } from '../services/apiHandler.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { FilterResultsService } from '../services/filterResults.service';


@Component({
  selector: 'app-results-box',
  templateUrl: './results-box.component.html',
  styleUrls: ['./results-box.component.css']
})

export class ResultsBoxComponent implements OnInit, OnDestroy {

  // ** events subs
  onGetResuletSubscription: Subscription;
  onFilterResultsSubscription: Subscription;
  onToggleFilterStateSubscription: Subscription;

  filterState = false;
  filterByUser = false;
  displayResults = [];
  searchResultList = [];


  color: string = '';

  hesNext = false;
  curPage = 0;

  constructor(private apiHandlerService: ApiHandlerService,
    private filterResultsService: FilterResultsService) { }

  
  ngOnInit() {
    this.onGetResuletSubscription = this.apiHandlerService.onGetResulet
      .subscribe((res) => {
        // console.log(res);
        this.displayResults = this.searchResultList = this.sortResultsByViewCount(res.queryResult);
        this.hesNext = res.hasNext;
        this.curPage = res.curPage;
        this.filterByUser = res.advancedSearch;
        console.log(this.displayResults);
      });

    this.onFilterResultsSubscription = this.filterResultsService.onFilterResults.subscribe(
      (textFilter: string) => {
        this.displayResults = this.filterCurResultsBytext(textFilter);
      });

    this.onToggleFilterStateSubscription = this.filterResultsService.onToggleFilterState.subscribe(() => {
      this.filterState = !this.filterState;
      if (!this.filterState) {
        this.displayResults = this.searchResultList; // un filtered retults
      }
      console.log(`filterState :`, this.filterState);
    });
  }

  ngOnDestroy(): void {
    this.onGetResuletSubscription.unsubscribe();
    this.onGetResuletSubscription.unsubscribe();
    this.onToggleFilterStateSubscription.unsubscribe();
  }

  // launch query for moving to next page // only if last query returned 'hasNext' as true 
  toNextPage() {
    if (this.hesNext) {
      this.apiHandlerService.onNextPage(this.filterByUser? this.filterByUser: undefined);
    }
  }

  // launch query for moving to prev page // only if last query returned 'curPage' > 1   
  toPrevPage() {
    if (this.curPage > 1) {
      this.apiHandlerService.onPrevPage(this.filterByUser? this.filterByUser: undefined);
    }
  }

  isDisplayResults() {
    return this.apiHandlerService.displayResults();
  }


  filterCurResultsBytext(filterText: string): Object[] {
    return this.searchResultList.filter((element) => {
      return element.title.includes(filterText);
    });
  }


  // sort the query results by view_count property
  sortResultsByViewCount(itemsArray) {
    return itemsArray.sort((a, b) => {
      if (a.view_count > b.view_count) {
        return -1;
      } else if (a.view_count < b.view_count) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  onSearchByUserQuery(uid: number) {
    this.apiHandlerService.onSendCurQueryFilteredByUser(uid);
  }



}
