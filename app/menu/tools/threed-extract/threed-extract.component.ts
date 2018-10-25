import { Component, AfterViewInit } from '@angular/core';

import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';

import { Subscription } from 'rxjs';

@Component({
  selector: 'extract-3d',
  templateUrl: './app/menu/tools/threed-extract/threed-extract.component.html',
  styles: [`
		:host button {
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

  constructor(private toolsNameService: ToolsNameService) { }

  toggleExtract() {
    this.toolActive = !this.toolActive;
		if (this.toolActive) {
			this.s = this.toolsNameService.currentToolName
				.subscribe((name) => {
					console.log(this.s, 'Name', name, ToolsList.extract)
					if (ToolsList.extract !== name) { this.closeMeasure() };
				});
		}

  }

  closeMeasure() {
    this.toolActive = false;
		this.s.unsubscribe();
		console.log(this.s)
  }

  ngAfterViewInit() {
    // this.toolsNameService.currentToolName.subscribe((name) => {
    //   console.log('Name', name, ToolsList.extract)
    //   if (ToolsList.extract !== name) {this.closeMeasure()};
    // });

  }

}
