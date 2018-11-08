import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';

import { Subscription } from 'rxjs';

@Component({
  selector: 'extract-3d',
  templateUrl: './app/menu/tools/threed-extract/threed-extract.component.html',
  styles: [`
		:host button {
			position: relative;
    	left: 160px;
	    margin: 10px;
	    padding: 6px 10px 6px 10px;
	    background-color: #e9e9e9;
	    border: 1px solid #53565d;
	    border-radius: 2px;
			font-size: 14px;
		}
	`]
})

export class ThreeDExtractComponent implements AfterViewInit {
  private toolActive = false;
  s: Subscription;

  constructor(private cdr: ChangeDetectorRef, private toolsNameService: ToolsNameService) {
    this.cdr.detach();
  }

  toggleExtract() {
    this.toolActive = !this.toolActive;
    if (this.toolActive) {
      // reatatch chnage detaction when we open tool
      this.cdr.reattach();

      this.s = this.toolsNameService.currentToolName
        .subscribe((name) => {
          console.log(this.s, 'Name', name, ToolsList.extract)
          if (ToolsList.extract !== name) { this.closeMeasure() };
        });
    } else {
      this.closeMeasure();
    }

  }

  closeMeasure() {
    this.toolActive = false;
    this.s.unsubscribe();
    console.log(this.s)

    //  detach changes detection
    // and last time detect changes when closing tool
    this.cdr.detach();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // this.toolsNameService.currentToolName.subscribe((name) => {
    //   console.log('Name', name, ToolsList.extract)
    //   if (ToolsList.extract !== name) {this.closeMeasure()};
    // });

  }

}
