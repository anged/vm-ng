import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';

import { MapService } from '../../../map.service';
import { MeasureMapService } from './measure-map.service';
import { ToolsNameService } from '../../tools-name.service';
import { ToolsList } from '../../tools.list';

import { Subscription } from 'rxjs';

@Component({
  selector: 'measure-map',
  templateUrl: './app/menu/tools/measure/measure-map.component.html',
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

export class MeasureMapComponent implements OnInit, AfterViewInit, OnChanges {
  private measureActive = false;

	// checking if first theme was inisiated before
	// if true, create new input data based on new theme
	firstThemeLoaded = false;
	s: Subscription;

  get change() {
    console.log('change measure');
    return '';
  }

	constructor(
		private mapService: MapService,
		private measureMapService: MeasureMapService,
		private toolsNameService: ToolsNameService
	) { }

	toggleMeasure() {
		this.measureActive = !this.measureActive;
		if (this.measureActive) {
			// destroy tool component if other component containing draw tool got opened
			this.s = this.toolsNameService.currentToolName.subscribe((name) => {
				console.log('Name M', name, ToolsList.measure)
				console.log(this.s)
				if  (ToolsList.measure !== name) {
					// TODO refactor, currently using setTimeout for ExpressionChangedAfterItHasBeenCheckedError
					setTimeout(() => {
						this.closeMeasure();
					});
				}
			});
		} else {
      this.closeMeasure();
    }
	}

	closeMeasure() {
		this.measureActive = false;
		this.s.unsubscribe();
		console.log(this.s)
	}

	ngOnInit() {
		const view = this.mapService.getView();
		view.on("layerview-create", (event) => {
			console.log(event)
			// wait for last layer to be loaded then init createInputsData
			if (!this.firstThemeLoaded) {
			 if (event.layer.id === "allLayers") {
				 // create buffer inputs data
				 this.measureMapService.createInputsData(view);
				 this.firstThemeLoaded =  true;
			 }
			} else {
				// create buffer inputs based on new theme
				this.measureMapService.createInputsData(view);
			}
		});
	}

	ngOnChanges(a) {
		console.log('Change', a)
	}

	ngAfterViewInit() {
		// // destroy tool component if other component containing draw tool got opened
		// this.toolsNameService.currentToolName.subscribe((name) => {
		// 	console.log('Name M', name, ToolsList.measure)
		// 	if  (ToolsList.measure !== name) {
		// 		setTimeout(() => {
		// 			this.closeMeasure();
		// 		});
		// 	}
		// });
	}

}
