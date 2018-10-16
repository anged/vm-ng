import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'common-widgets',
  template: `
    <div id="widgets" *ngIf="view">
			<ng-content></ng-content>
			<menu-map [view]="view"></menu-map>
      <scale-map [view]="view"></scale-map>
      <compass-map [view]="view"></compass-map>
      <credits-map></credits-map>
      <basemap-toggle [view]="view"></basemap-toggle>
    </div>
    `
})

export class CommonWidgetsComponent implements OnInit {
  @Input() view: any;
	@HostBinding('style.display') display;

	ngOnInit() {
		console.log("W HOST", this.display);
	}

};
