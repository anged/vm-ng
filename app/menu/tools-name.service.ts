import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class ToolsNameService {
	private subject = new Subject<any>();
	//using 2 buttons
	currentToolName = this.subject.asObservable()
		.pipe(
			take(2)
		);

	setCurentToolName(name: string) {
		this.subject.next(name);
	}
}
