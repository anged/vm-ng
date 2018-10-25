import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef } from '@angular/core';

import { MapService } from '../../../map.service';
import { MenuToolsService } from '../../menu-tools.service';
import { MeasureMapService } from './measure-map.service';
import { ToolsNameService } from '../../tools-name.service';
import { AnalyzeParams } from './AnalyzeParams';
import { ToolsList } from '../../tools.list';
import PolygonDrawAction = require('esri/views/2d/draw/PolygonDrawAction');

import isEmpty from 'lodash-es/isempty';

import forOwn from 'lodash-es/forOwn';

@Component({
  selector: 'measure-container',
  templateUrl: './app/menu/tools/measure/measure-container.component.html',
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

export class MeasureContainerComponent implements OnInit, OnDestroy {
  //@Input('measureActive') measureActive: boolean;
  @ViewChild('bufferCheckbox') bufferCheckbox: ElementRef;

  view: any;
  draw: any;
  activeToolsState = false;
  activeTool = "";
  checkboxChecked: boolean;
  canCreateBuffer: boolean = true;
  analyzeParams: AnalyzeParams = {
    bufferSize: 1,
    inputlayer: null,
    chosenUnit: "km"
  };

  units = [
    "km", "m"
  ];

  measureActiveOpt: any = {
    pointActive: {
      name: "draw-point",
      active: false
    },
    lineActive: {
      name: "draw-line",
      active: false
    },
    polyActive: {
      name: "draw-polygon",
      active: false
    }
  };

  //dojo draw events handlers Array
  eventHandlers = [];

  constructor(
    private mapService: MapService,
    private measureMapService: MeasureMapService,
    private toolsNameService: ToolsNameService
  ) { }

  ngOnInit() {
    this.view = this.mapService.getView();

    // add draw capabilities for temporary geometries
    this.view.then(() => {
      this.draw = this.measureMapService.initDraw(this.view);
    });

		// set tool name Obs
    this.toolsNameService.setCurentToolName(ToolsList.measure);
  }

  checkBoxChange() {
    this.checkboxChecked = this.bufferCheckbox.nativeElement.checked;
    this.measureMapService.resetCalculate();
  }


  restoreDefault() {
    //  set active tool to empty string
    this.activeTool = "";
    this.measureMapService.resetCalculate();
    console.log('draw', this.draw);

    this.view.graphics.removeAll();
  }

  //remove eventHandlers
  removeEventHandlers() {
    this.eventHandlers.forEach((event) => {
      event.remove();
    });
    this.eventHandlers = [];
  }

  drawElement() {
    //esri draw approach
    //this.view.graphics.removeAll(); //TODO check if we need to removeAll in final solution
    //TODO refactor

    switch (this.activeTool) {
      case "draw-polygon":
        this.enableCreatePolygon(this.draw, this.view, this.activeTool);
        break;
      case "draw-line":
        this.enableCreatePolyline(this.draw, this.view);
        break;
      case "draw-point":
        this.enableCreatePoint(this.draw, this.view);
        break;
    }
  }

  // U
  selectDrawEl(evt, id) {
    if (id === this.activeTool) {
      this.activeTool = "";
      this.resetTools();
    } else {
      //suspend layers toggle (e.g. suspend layers while drawing with measure tools)
      this.mapService.suspendLayersToggle();
      this.resetTools();
      this.activateTool(id);
      this.drawElement();
    }
  }

  // U
  resetTools() {
    console.log('activeToolsState', this.activeToolsState, this.activeTool )
		// TODO cancel requests

    // complete 2d draw action since 4.5 complete() method is available
    const action = this.draw.activeAction as PolygonDrawAction

    if (!isEmpty(action)) {
      console.log('action', action)
      action.complete();

      // BUG Fix: in order to unsuspend run destroy as well
      // BUG effects if we closing draw feature after first draw element has been added
      //action.destroy();

      this.draw.activeAction = null;
    }

    this.measureMapService.resetCalculate();

    this.view.graphics.removeAll();

    console.log('VIEW graphics', this.view.graphics)

    //reset eventHandler events
    this.removeEventHandlers();

    //unsuspend layers
    if (this.mapService.getSuspendedIdentitication()) {
      this.mapService.unSuspendLayersToggle();
    }
  }

  //activate measure tools based on id
  activateTool(id: string) {
    //check if any tool is active
    this.activeToolsState = false;
    //iterate with lodash
    forOwn(this.measureActiveOpt, (value, key) => {
      //active tools
      if (value.name === id) {
        value.active = !value.active;
        //add or remove disabled attribute and activeTool name
        this.activeToolsState = true;
        this.activeTool = value.name;

      }
    });
  }

  //Polygon approach
  enableCreatePolygon(draw, view, activeTool) {
    // create() will return a reference to an instance of PolygonDrawAction
    let action = this.draw.create("polygon");
    // focus the view to activate keyboard shortcuts for drawing polygons
    this.view.focus();
    // listen to vertex-add event on the action
    this.eventHandlers.push(action.on("vertex-add", (e) => {
      this.measureMapService.drawPolygon(e, this.analyzeParams);
    }));
    // listen to cursor-update event on the action
    this.eventHandlers.push(action.on("cursor-update", (e) => this.measureMapService.drawPolygon(e, this.analyzeParams)));
    // listen to vertex-remove event on the action
    this.eventHandlers.push(action.on("vertex-remove", (e) => this.measureMapService.drawPolygon(e, this.analyzeParams)));
    // listen to draw-complete event on the action
    this.eventHandlers.push(action.on("draw-complete", (e) => {
      this.measureMapService.drawPolygon(e, this.analyzeParams, true);
      this.checkboxChecked && this.activeTool && (this.view.graphics.items.length > 0) && (this.measureMapService.createBuffer(this.analyzeParams, e));
    }));
  }

  //Polyline approach
  enableCreatePolyline(draw, view) {
    let action = draw.create("polyline");

    // listen to PolylineDrawAction.vertex-add
    // Fires when the user clicks, or presses the "F" key
    // Can also fire when the "R" key is pressed to redo
    this.eventHandlers.push(action.on("vertex-add", (evt) => {
      this.measureMapService.createPolylineGraphic(evt, this.analyzeParams);
    }));

    // listen to PolylineDrawAction.vertex-remove
    // Fires when the "Z" key is pressed to undo the
    // last added vertex
    this.eventHandlers.push(action.on("vertex-remove", (evt) => {
      this.measureMapService.createPolylineGraphic(evt, this.analyzeParams);
    }));

    // listen to PolylineDrawAction.cursor-update
    // fires when the pointer moves over the view
    this.eventHandlers.push(action.on("cursor-update", (evt) => {
      this.measureMapService.createPolylineGraphic(evt, this.analyzeParams);
    }));

    // listen to PolylineDrawAction.draw-complete
    // event to create a graphic when user double-clicks
    // on the view or presses the "C" key
    this.eventHandlers.push(action.on("draw-complete", (evt) => {
      console.log('COMPLETE EVENT', evt)
      this.measureMapService.createPolylineGraphic(evt, this.analyzeParams, true);
      this.checkboxChecked && this.activeTool && (this.view.graphics.items.length > 0) && (this.measureMapService.createBuffer(this.analyzeParams, evt));
      //set active tool to empty string
      this.activeTool = "";
    }));
  }

  //Point approach
  enableCreatePoint(draw, view) {
		// TODO add action property to component and complete() on draw toolbox close
    let action = draw.create("point");

    // PointDrawAction.cursor-update
    // Give a visual feedback to users as they move the pointer over the view
    this.eventHandlers.push(action.on("cursor-update", (evt) => {
      this.measureMapService.createPointGraphic(evt, this.analyzeParams);
    }));

    // PointDrawAction.draw-complete
    // Create a point when user clicks on the view or presses "C" key.
    this.eventHandlers.push(action.on("draw-complete", (evt) => {
      this.measureMapService.createPointGraphic(evt, this.analyzeParams);
      this.checkboxChecked  && this.activeTool && (this.view.graphics.items.length > 0) && (this.measureMapService.createBuffer(this.analyzeParams, evt));
      //set active tool to empty string
      this.activeTool = "";
    }));
  }


  ngOnDestroy() {
    this.checkboxChecked = false;
    this.measureMapService.resetCalculate();
    this.restoreDefault();
    this.resetTools();
  }

}
