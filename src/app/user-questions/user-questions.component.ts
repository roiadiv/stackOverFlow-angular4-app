import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiHandlerService } from '../services/apiHandler.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-questions',
  templateUrl: './user-questions.component.html',
  styleUrls: ['./user-questions.component.css']
})
export class UserQuestionsComponent implements OnInit, OnDestroy {
  
  routeParamsSubscription: Subscription;
  userQuestionsQuerySubscription: Subscription;

  returnedWithEmptyResults = false;
  userQuestions = [];

  constructor(private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService) {}


  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      const uid = params.uid;
      console.log(uid);
      // query from the service the user data by his uid
      this.apiHandlerService.onLaunchUserQuestionsQuery(uid);
    })

    this.apiHandlerService.onGetUserQuestions.subscribe((res) => {
      if(res.queryResult.length === 0 ) {
        this.returnedWithEmptyResults = true;
      }
      console.log(res);
      this.userQuestions = res.queryResult;
    });
  }

  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
    this.userQuestionsQuerySubscription.unsubscribe();
  }

  // toNextPage() {
  //   if (this.hesNext) {
  //     this.apiHandlerService.onNextPage();
  //   }
  // }

  // // launch query for moving to prev page // only if last query returned 'curPage' > 1   
  // toPrevPage() {
  //   if (this.curPage > 1) {
  //     this.apiHandlerService.onPrevPage();
  //   }
  // }


}
