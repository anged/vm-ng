import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MapService } from '../../map.service'

export interface DataStore {
  elderates: any[],
  mainInfo: any[],
  summary: any[],
  info: any[]
}

@Injectable()
export class MapKindergartensService {
  // Observable  for kindergartens
  private kGartensObs = new Subject<DataStore>();
  // Observable item stream
  kGartensData = this.kGartensObs.asObservable();

  dataStore: DataStore = {
    elderates: null,
    mainInfo: null,
    info: null,
    summary: null
  };

  constructor(private mapService: MapService) { }

  //get All Data
  getAllQueryData(urlStr: string, name: string, outFields) {
    let query = this.mapService.addQuery();
    const queryTask = this.mapService.addQueryTask(urlStr);
    //get all data
    query.where = "1=1";
    query.outFields = outFields;
    query.returnGeometry = false;
    return queryTask.execute(query).then((result) => {
      this.dataStore[name] = result.features.map(feature => feature.attributes);
      this.kGartensObs.next(this.dataStore);
    }, (error) => { console.error(error); });
  }

}
