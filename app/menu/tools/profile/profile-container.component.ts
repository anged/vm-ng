import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { MapService } from '../../../map.service';
import { ProfileToolService } from './profile-tool.service';
import { ToolsNameService } from '../../tools-name.service';


import Draw = require('esri/views/2d/draw/Draw');

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
	  .esri-widget-button {
			width: 160px;
	    margin-right: 40px;
	    margin-left: auto;
	    padding: 20px;
	    font-size: 14px;
	    border: 1px solid #53565d;
    	background-color: #e9e9e9;
	    margin-bottom: 10px;
	    border-radius: 2px;
			font-size: 16px;
	   }
	  :host .esri-widget-button.active {
			background-color: #53565d;
	    border: 1px solid #53565d;
			color: #fff;
	   }
	   .esri-icon-polyline {
	     margin-right: 10px;
			 font-size: 17px;
	   }
		 .mat-spinner.mat-progress-spinner {
			 position: absolute;
			 transform: translate(50%, -50%);
			 top: calc(50% - 30px);
			 right: 50%;
		 }
	`]
})

export class ProfileContainerComponent implements OnInit, OnDestroy {
  private drawActive = false;

  //dojo draw events handlers Array
  private eventHandlers = [];
  chartData: any;
  view: any;
  draw: Draw;

  constructor(
		private cdr: ChangeDetectorRef,
    private mapService: MapService,
    private profileToolService: ProfileToolService,
    private toolsNameService: ToolsNameService
  ) {
		//this.cdr.detach()
	}

  ngOnInit() {
    this.view = this.mapService.getView();

    // add draw capabilities for temporary geometries
    this.view.then(() => {
      this.draw = this.profileToolService.initDraw(this.view);
      this.profileToolService.initGeoprocessor(this.view);
    });
  }

  toggleDraw() {
    this.drawActive = !this.drawActive;
  }

  selectDrawEl(): void {
    // order is important
    this.toggleDraw();

    // if button was active (after taggle becomes false)
    // button behaves as reset button and starts to draw
    if (!this.drawActive) {
      //this.resetTools();
      this.enableCreatePolyline();
      this.toggleDraw();
    } else {
      // TODO implement ssuspend hitTest of feature layers
      this.mapService.suspendLayersToggle();
      this.enableCreatePolyline();
    }
  }

  //Polygon approach
  enableCreatePolyline(): void {
    // create() will return a reference to an instance of PolygonDrawAction
    let action = this.draw.create("polygon");

    // focus the view to activate keyboard shortcuts for drawing polygons
    this.view.focus();

    // listen to vertex-add event on the action
    this.eventHandlers.push(action.on("vertex-add", (e) => this.profileToolService.createPolylineGraphic(e)));

    // listen to cursor-update event on the action
    this.eventHandlers.push(action.on("cursor-update", (e) => this.profileToolService.createPolylineGraphic(e)));

    // listen to vertex-remove event on the action
    this.eventHandlers.push(action.on("vertex-remove", (e) => this.profileToolService.createPolylineGraphic(e)));

    // listen to draw-complete event on the action
    this.eventHandlers.push(action.on("draw-complete", (e) => {
      this.profileToolService.createPolylineGraphic(e, true).then((result) => {
        this.chartData = result;
        console.log(result);
				// detect changes for view and child components
				this.cdr.detectChanges();
      });
      this.toggleDraw();
    }));
  }

  ngOnDestroy() {
  }

}
