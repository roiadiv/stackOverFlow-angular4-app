import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/Subject';

@Injectable()// have to use this decoretor to inject dependencied of other services (in this case HttpCilent service)
export class ApiHandlerService {
  private readonly apiUrl = 'https://api.stackexchange.com/2.2/';

  // data: any = {};
  private curQueryParams: HttpParams = null;

  // ** events 
  onGetResulet: Subject<any> = new Subject<any>();
  onGetUserQuestions: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) { }

  onLaunchQuery(queryParams) {
    console.log(`getResults(${queryParams})`);
    let params: HttpParams = new HttpParams({
      fromObject: queryParams
    });

    this.sendSearchQurey(params, `${this.apiUrl}search`);
  }

  private sendSearchQurey(params: HttpParams, curQueryUrl: string, doesAdvanced?: boolean) {
    console.log(`sendQurey(${params}: HttpParams)`);
    this.getData(params, curQueryUrl).subscribe((data) => {

      let queryResult = [];
      data.items.forEach(element => {
        queryResult.push(element);
      });

      this.curQueryParams = params;
      let curPage = parseInt(this.curQueryParams.get('page'));


      this.onGetResulet.next({
        queryResult,
        hasNext: data.has_more,
        curPage: curPage,
        advancedSearch: doesAdvanced
      });
    }, error => {
      console.log(error);
    });
  }

  private getData(params: HttpParams, curQueryUrl: string): Observable<any> {
    console.log(`getData(${params}: HttpParams)`);
    return this.httpClient.get(curQueryUrl, { params });
  }

  // 
  onNextPage(doesAdvanced?: boolean) {
    this.pageMove(1, doesAdvanced);

  }

  onPrevPage(doesAdvanced?: boolean) {
    this.pageMove(-1, doesAdvanced);
  }

  private pageMove(dirction: number, doesAdvanced?: boolean) {
    if (this.curQueryParams) {
      let curQueryUrl = `${this.apiUrl}search${doesAdvanced ? '/advanced' : ''}`;
      let curPage = parseInt(this.curQueryParams.get('page'));
      this.curQueryParams = this.curQueryParams.set('page', `${curPage + dirction}`);
      this.sendSearchQurey(this.curQueryParams, curQueryUrl, doesAdvanced);
    } else {
      console.log("bad req");
    }
  }


  onSendCurQueryFilteredByUser(uid: number) {
    this.curQueryParams = this.curQueryParams.set('page', `1`).set('user', `${uid}`);
    this.sendSearchQurey(this.curQueryParams, `${this.apiUrl}search/advanced`, true);
  }

  displayResults(): boolean {
    return this.curQueryParams !== null;
  }

  onLaunchUserQuestionsQuery(uid: number) {
    this.curQueryParams
    let params: HttpParams = new HttpParams({
      fromObject: {
        site: 'stackoverflow'
      }
    });
    this.getData(params, this.apiUrl + `users/${uid}/questions`).subscribe((data) => {
      let queryResult = [];
      data.items.forEach(element => {
        queryResult.push(element);
      });
      this.onGetUserQuestions.next({
        queryResult,
      });
    }, error => {
      console.log(error);
    });
  }

}