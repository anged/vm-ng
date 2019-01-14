import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable()
export class SwipeToolService {
	private subject = new Subject<boolean>();
	toolActive$ = this.subject.asObservable().pipe(
		throttleTime(1000),
	)

  constructor(
  ) { }

	getSwipeStatus() {
		return this.toolActive$;
	}

	closeSwipe() {
		this.subject.next(false);
	}

	toggleSwipe(state) {
			this.subject.next(state);
	}

}
