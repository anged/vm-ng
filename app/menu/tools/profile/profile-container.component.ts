import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { MapService } from '../../../map.service';


@Component({
  selector: 'profile-container',
  templateUrl: './app/menu/tools/profile/profile-container.component.html',
  styles: [`
		:host button {
	    margin: 10px;
	    padding: 6px 10px 6px 10px;
	    background-color: #e9e9e9;
	    border: 1px solid #53565d;
	    border-radius: 2px;
			font-size: 14px;
		}
		.form-control {
			border: 1px solid #ccc;
		}
	`]
})

export class ProfileContainerComponent implements OnInit, OnDestroy {

  ngOnInit() {

  }

  ngOnDestroy() {
  }

}
