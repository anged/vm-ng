import { Component } from '@angular/core';

import { ProfileToolService } from './profile-tool.service';

@Component({
  selector: 'profile-tool-container',
  templateUrl: './app/menu/tools/profile/profile-tool-container.component.html',
  styles: [`
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
			margin: 20px;
	    background: #e9e9e9;
	    width: calc(100vw - 40px);
	    bottom: 0;
			box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
			-webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
			-moz-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
			z-index: 999;
	   }
	   @media only screen and (max-width: 1382px) {
	     .profile-tool {
		      position: absolute;
		      background: #e9e9e9;
		      width: calc(100vw - 600px);
		      bottom: 0;
		      left: 380px;
	      }
	    }
	`]
})

export class ProfileToolContainerComponent {

	constructor(private profileToolService: ProfileToolService) { }

	closeMeasure() {
		this.profileToolService.closeMeasure();
	}

}
