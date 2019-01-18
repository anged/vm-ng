import { Injectable } from '@angular/core';

import { Observable, Subject, ReplaySubject } from 'rxjs';
import { publish, refCount, tap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapStatusService {
	private mapViewOserver$ = new ReplaySubject<boolean>();
	mapViewState$ = this.mapViewOserver$.asObservable().pipe(
		tap((a) => console.log('Subscribing ' + a)),
		// publish(),
		// refCount()
	)

  constructor() { }

	setMapViewState(state: boolean): void {
		this.mapViewOserver$.next(state);
	}

}
