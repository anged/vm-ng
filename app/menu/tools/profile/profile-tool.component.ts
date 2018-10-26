import { Component, OnInit } from '@angular/core';

import { MapService } from '../../../map.service';

@Component({
  selector: 'profile-tool',
  templateUrl: './app/menu/tools/profile/profile-tool.component.html',
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

export class ProfileToolComponent implements OnInit {
  toolActive = false;

	constructor(
		private mapService: MapService
	) { }

	toggleMeasure() {
		this.toolActive = !this.toolActive;
	}

	closeMeasure() {
		this.toolActive = false;
	}

	ngOnInit() {
		const view = this.mapService.getView();
	}


}
