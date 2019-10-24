import { Component } from '@angular/core';

import { SwipeToolService } from './swipe-tool.service';

@Component({
  selector: 'swipe-tool-container',
  template: `
		<ng-container>
			<swipe-container></swipe-container>
		</ng-container>
	`,
  styleUrls: ['app/menu/tools/swipe/swipe-tool-container.component.css']
})

export class SwipeToolContainerComponent { }
