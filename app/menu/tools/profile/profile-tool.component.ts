import { Component, OnInit } from '@angular/core';

import { MapService } from '../../../map.service';

@Component({
  selector: 'profile-tool',
  templateUrl: './app/menu/tools/profile/profile-tool.component.html',
  styles: [`
		:host button {
	    position: relative;
	    left: 10px;
	    margin: 10px;
	    padding: 6px 10px 6px 10px;
	    background-color: #e9e9e9;
	    border: 1px solid #53565d;
	    border-radius: 2px;
			font-size: 14px;
	}
  :host #measure-container .measure {
    position: absolute;
    padding: 12px 15px;
    overflow-y: auto;
    width: 100%;
  }
  :host .measure-tool.buffer-tool {
    margin-left: 0;
    top: 130px;
    width: 100%;
  }
  .profile-tool {
    position: absolute;
    background: #ffffff;
    width: calc(100vw - 40px);
    bottom: 0;
   }
   @media only screen and (max-width: 1382px) {
     .profile-tool {
      position: absolute;
      background: #ffffff;
      width: calc(100vw - 600px);
      bottom: 0;
      left: 380px;
      }
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
