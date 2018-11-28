import { Injectable } from '@angular/core';

import { Subject, Observable, Observer } from 'rxjs';
import { filter } from 'rxjs/operators';

import QueryTask = require("esri/tasks/QueryTask");
import Query = require("esri/tasks/support/Query");

export interface DataStore {
  elderates: any[],
  mainInfo: any[],
  summary: any[],
  info: any[]
}

@Injectable()
export class MapKindergartensService {
  // Observable  for kindergartens
  //private kGartensObs = new Subject<any>();
  private kGartensObs: Observer<DataStore>;
  // Observable item stream
  // kGartensData = this.kGartensObs.asObservable().pipe(
  //   filter(data => data.elderates && data.mainInfo && data.info && data.summary)
  // );
  kGartensData = new Observable<any>(observer => this.kGartensObs = observer).pipe(
    filter(data => data.elderates && data.mainInfo && data.info && data.summary)
  );

  dataStore: DataStore = {
    elderates: null,
    mainInfo: null,
    info: null,
    summary: null
  };

  constructor() { }

  //get All Data
  getAllQueryData(urlStr: string, name: string, outFields) {
    let query = this.addQuery();
    const queryTask = this.addQueryTask(urlStr);
    //get all data
    query.where = "1=1";
    query.outFields = outFields;
    query.returnGeometry = false;
    return queryTask.execute(query).then((result) => {
      this.dataStore[name] = result.features.map(feature => feature.attributes);
      this.kGartensObs.next(this.dataStore);
    }, (error) => { console.error(error); });
  }

  getAllQueryDataPromise(urlStr: string, name: string, outFields) {
    let query = this.addQuery();
    const queryTask = this.addQueryTask(urlStr);
    //get all data
    query.where = "1=1";
    query.outFields = outFields;
    query.returnGeometry = false;
    return queryTask.execute(query).then(r => r);
  }

  returnAllQueryData() {
		console.log(this.dataStore)
    return this.dataStore;
  }

  addQuery() {
    return new Query();
  }

  addQueryTask(url: string) {
    return new QueryTask({ url });
  }

}
