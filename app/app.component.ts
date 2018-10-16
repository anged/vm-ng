import { Component, OnInit } from '@angular/core';

// require('@angular/material/prebuilt-themes/indigo-pink.css');

@Component({
  selector: 'vilnius-maps',
  templateUrl: './app/app.component.html',
	styles: [`
		.mat-progress-bar {
		    _display: none;
			}
	`]
})
export class AppComponent implements OnInit {

	constructor() {}

	ngOnInit() {
		console.log('%c MAP INIT', 'font-size: 30px; color: orange');
	}
};
