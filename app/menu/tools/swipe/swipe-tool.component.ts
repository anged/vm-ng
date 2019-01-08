import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';

import { Subscription } from 'rxjs';

@Component({
  selector: 'swipe-tool',
  template: `
		<button id="measure-button" class="tool-button" (click)="toggleSwipe()" [class.active]="toolActive">
			<span class="svg-measure">
				<svg width="22" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">
					<image *ngIf="!toolActive; else svgToolW" xlink:href="../../app/img/svg/swipe.svg" x="0" y="0" height="22px" width="16px"/>
					<ng-template #svgToolW><image xlink:href="../../app/img/svg/swipe-w.svg" x="0" y="0" height="22px" width="16px"/></ng-template>
				</svg>
			</span>
			Palyginimas
		</button>
	`,
  styles: [`
		:host button {
	    margin: 10px;
	    padding: 6px 10px 6px 10px;
	    background-color: #e9e9e9;
	    border: 1px solid #53565d;
	    border-radius: 2px;
			font-size: 14px;
		}
		.svg-measure {
			font-size: 16px;
	    top: 2px;
		}
	`]
})

export class SwipeToolComponent implements AfterViewInit {
  private toolActive = false;
  s: Subscription;

  constructor(private cdr: ChangeDetectorRef, private toolsNameService: ToolsNameService) {}

  toggleSwipe() {
    this.toolActive = !this.toolActive;
    if (this.toolActive) {
      // reatatch chnage detaction when we open tool
      this.cdr.reattach();

			// set tool name Obs
			this.toolsNameService.setCurentToolName(ToolsList.swipe);

      this.s = this.toolsNameService.currentToolName
        .subscribe((name) => {
          if (ToolsList.swipe !== name) { this.closeMeasure() };
        });
    } else {
      this.closeMeasure();
    }

  }

  closeMeasure() {
    this.toolActive = false;
    this.s.unsubscribe();

    //  detach changes detection
    // and last time detect changes when closing tool
    this.cdr.detach();
    this.cdr.detectChanges();
  }

	ngAfterViewInit() {
		this.cdr.detach();
	}

}
