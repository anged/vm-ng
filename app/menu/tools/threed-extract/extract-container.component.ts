import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs';

import { MapOptions } from '../../../options';
import { MapService } from '../../../map.service';
import { Symbols } from '../../symbols';
import { MenuToolsService } from '../../menu-tools.service';

import { leaveEnterTransition } from '../../../animations/leaveEnter-transition'

import Geoprocessor = require('esri/tasks/Geoprocessor');
import Draw = require('esri/views/2d/draw/Draw');
import PolygonDrawAction = require('esri/views/2d/draw/PolygonDrawAction');
import Graphic = require('esri/Graphic');
import Polygon = require('esri/geometry/Polygon');
import FeatureSet = require('esri/tasks/support/FeatureSet');
import geometryEngine = require('esri/geometry/geometryEngine');

import isEmpty from 'lodash-es/isempty';

enum FileIndex {
  blogasDydis = 0,
  collada,
  obj,
  ds,
  pdf,
}

@Component({
  selector: 'extract-container',
  animations: [leaveEnterTransition],
  templateUrl: './app/menu/tools/threed-extract/extract-container.component.html',
  styles: [`
		:host .extract-content {
			margin-top: 20px;
	    border-top: 1px solid #8a8d93;
		}
		:host .extract-content .esri-widget.esri-widget-button {
			width: 100%;
	    height: auto;
	    margin-top: 5px;
	    font-size: 16px;
	    color: #53575d;
	    border: none;
	    display: block;
	    border-radius: 2px;
	    background: none;
		}
	  :host .extract-content button {
			width: 100%;
			margin: 0;
	    padding: 10px;
	    background-color: #e9e9e9;
			border: none;
	    border-radius: 2px;
			font-size: 16px;
		}
	  :host .extract-content .alert .close {
			width: auto;
    	padding: 0;
    	background-color: rgba(255, 255, 255, 0);
		}
		:host .extract-content button.button-margin-top {
			margin-top: 10px;
		}
		.alert-margin-top {
			margin-top: 20px;
			margin-bottom: 0;
		}
	  :host .extract-content .active button,
		:host .extract-content .active .esri-widget.esri-widget-button {
			background-color: #53565d;
			color: #f8f8f8;
		}
	  :host .extract-content button.esri-icon-clear,
		:host .extract-content button.button-clear {
			 background-color: #fbd5d7;
		}
	  :host .extract-content button.esri-icon-clear:hover,
		:host .extract-content button.esri-icon-clear:hover p {
			background-color: #e61c24;
		}
	  :host .extract-content button p {
	    font-family: "Avenir Next W00","Avenir Next",Avenir;
			display: inline;
		}
	  :host .extract-content .active button p {
	    color: #f8f8f8;
		}
		:host .extract-content .alert button.close:hover {
			 color: #e61c24;
		}
		:host .extract-content .alert-danger {
			 	cursor: pointer;
		}
		:host .extract-content button:hover,
		:host .extract-content button:hover p {
			background-color: #53565d;
			color: #f8f8f8;
		}
		a {
			background: #e61c24;
	    color: white !important;
	    padding: 4px;
	    margin: 10px 5px 10px 2px;
	    display: inline-block;
	    border-radius: 2px;
		}
	 .alert-danger ol, ul {
	    margin-bottom: 0;
	    padding-inline-start: 15px;
		}
		.alert.alert-success {
			margin-top: 0;
			margin-bottom: 20px;
		}
	`]
})

export class ExtractContainerComponent implements OnInit {
  @Input('toolActive') toolActive: boolean;

  subscription: Subscription;
  view: any;
  draw: Draw;

  polygon: any;

  private drawActive = false;

  isLinear = false;

  //dojo draw events handlers Array
  private eventHandlers = [];

  @ViewChild('stepper') stepper;
  @ViewChild('stepFirst') stepFirst: MatStepper;
  @ViewChild('stepSecond') stepSecond: MatStepper;

  // file results promises
  fileResults = [];
  // file results urls
  fileResultsurls = {
    pdf: null,
    collada: null,
    obj: null,
    ds: null,
    succes: false
  };

  graphic: Graphic;

  calculatedUnits: number

  extracDisabled = true;

  pdfUrl: string;

  jobId: string;
  job: IPromise<any>

  geo: Geoprocessor;

  constructor(
    private mapService: MapService,
    private menuToolsService: MenuToolsService
  ) { }

  ngOnInit() {
    // set previuos step uneditabvle
    this.subscription = this.stepper.selectionChange.subscribe((stepper) => {
      console.log("STEP changed", stepper);
      stepper.previouslySelectedStep.editable = false;
    });

    this.view = this.mapService.getView();

    //add draw capabilities for temporary geometries
    this.view.then(() => {
      this.draw = new Draw({
        view: this.view
      });
    });

    const url = MapOptions.mapOptions.staticServices.extract3DGP;
    this.geo = new Geoprocessor({
      url,
      outSpatialReference: this.view.spatialReference
    });

  }

  toggleExtract() {
    this.toolActive = !this.toolActive;
  }

  toggleDraw() {
    this.drawActive = !this.drawActive;
  }

  selectDrawEl(evt, id) {
    // order is important
    this.toggleDraw();

    // if button was active (after taggle becomes false) button behaves as reset button and starts to draw
    if (!this.drawActive) {
      this.resetTools();
      //this.mapService.suspendLayersToggle();
      this.enableCreatePolygon();
      this.toggleDraw();
    } else {
      this.mapService.suspendLayersToggle();
      this.enableCreatePolygon();
    }
  }

  // add step logic after draw complete event
  addStep(step: MatStepper) {
    console.log("STEPPER 1", this.stepper, this.stepFirst, this.stepSecond);
    //this.stepper.selected = this.stepSecond;
    this.stepper.selected = step;
    this.stepper.selected.completed = true
    this.isLinear = true;
    this.stepper.next();
  }

  resetDraw() {
    this.stepper.reset();
  }

  //Polygon approach
  enableCreatePolygon() {
    // create() will return a reference to an instance of PolygonDrawAction
    let action = this.draw.create("polygon");
    // focus the view to activate keyboard shortcuts for drawing polygons
    this.view.focus();
    // listen to vertex-add event on the action
    this.eventHandlers.push(action.on("vertex-add", (e) => this.drawPolygon(e)));
    // listen to cursor-update event on the action
    this.eventHandlers.push(action.on("cursor-update", (e) => this.drawPolygon(e)));
    // listen to vertex-remove event on the action
    this.eventHandlers.push(action.on("vertex-remove", (e) => this.drawPolygon(e)));
    // listen to draw-complete event on the action
    this.eventHandlers.push(action.on("draw-complete", (e) => { this.drawPolygon(e, true) }));
  }

  drawPolygon(evt, ended = false) {
    //on complete remove class
    this.deactivateAndDisable(evt);

    let vertices = evt.vertices;
    //remove existing graphic
    this.view.graphics.removeAll();
    // create a new polygon
    const polygon = new Polygon({
      rings: vertices,
      spatialReference: this.view.spatialReference
    });

    // create a new graphic representing the polygon, add it to the view
    let graphic = new Graphic({
      geometry: polygon,
      symbol: Symbols.polygonSymbol
    });

    // using graphic to show clear button
    // add only if graphic has more than 1 vertex, equal length mroe than 2 arrays
    if (polygon.rings[0].length > 1) {
      this.graphic = graphic;
    }

    this.view.graphics.add(graphic);

    if (evt.type === "draw-complete") {
      console.log('AREA ha', this.calculatedUnits);
      if (this.calculatedUnits < 15) {
        this.addStep(this.stepFirst);
        this.toggleDraw();
      }

    }

    // calculate the area of the polygon
    let area = geometryEngine.planarArea(polygon, "hectares");
    if (area < 0) {
      area = - area;
    }
    // start displaying the area of the polygon
    this.labelAreas(polygon, area, ended);
  }

  //Label polyon with its area
  labelAreas(geom, area, ended) {
    const graphic = this.menuToolsService.createAreaLabelGraphic(geom, area, ended, 'ha');
    this.view.graphics.add(graphic);

    this.calculatedUnits = area.toFixed(4);
  }

  toggleExtractBtn() {
    this.extracDisabled = !this.extracDisabled;
  }

  initExtract() {
    this.toggleExtractBtn();
    this.fileResults = [];
    const featureSet = new FeatureSet();
    featureSet.features = [this.graphic];
    const params = {
      'Teritorija': featureSet
    };


    this.job = this.geo.submitJob(params);
    this.job.then((res) => {
      console.log('RESPONSE', res)
      this.addStep(this.stepSecond);
      this.jobId = res.jobId

      setTimeout(() => {
        this.toggleExtractBtn();
      }, 200);

      if (res.jobStatus !== 'job-failed') {
        //get results
        const collada = this.geo.getResultData(res.jobId, 'COLLADA_zip');
        const obj = this.geo.getResultData(res.jobId, 'OBJ_zip');
        const ds = this.geo.getResultData(res.jobId, '3DS_zip');
        const pdf = this.geo.getResultData(res.jobId, 'PDF_zip_');
        const blogasDydis = this.geo.getResultData(res.jobId, 'BlogasDydis');

        // order is important check enum FileIndex
        this.fileResults.push.apply(this.fileResults, [blogasDydis, collada, obj, ds, pdf]);

        this.filePromise(this.fileResults);

        console.log('JOB', this.job);
      } else {
        this.fileResultsurls.succes = false;
      }

    }).catch(function(error) {
      console.error('ERROR', error)
    });

  }

  filePromise(fileResults: any) {
    //check first promise for fault results
    fileResults[FileIndex.blogasDydis].then((res) => {
      if (!res.value) {
        this.fileResultsurls.succes = true;
        this.executeFilesPromises(fileResults);

      } else {
        this.fileResultsurls.succes = false;
      }
    });
  }

  executeFilesPromises(fileResults: any[]) {
    fileResults.forEach((filePromise, index) => {
			if (index > 0) {
				filePromise.then((res) => {
					console.log('RESPONSE 2', res)

					switch (index) {
						case FileIndex.obj:
							this.fileResultsurls.obj = res.value.url;
							break;
						case FileIndex.ds:
							this.fileResultsurls.ds = res.value.url;
							break;
						case FileIndex.collada:
							this.fileResultsurls.collada = res.value.url;
							break;
						case FileIndex.pdf:
							this.fileResultsurls.pdf = res.value.url;
							break;
					}
				}).catch(function(error) {
					this.fileResultsurls.succes = false;
					console.error('ERROR FILE', error)
				});
			}
    })
  }

  cancelJob(jobId) {
    if (this.job) {
      //this.toggleExtractBtn();
      this.job.cancel();
      console.log('jobId', jobId, this.job, this.geo)
      this.geo.cancelJob(jobId);
    }
  }

  deactivateAndDisable(evt) {
    // on complete remove class
    // check if drawActive -> unsuspend
    if ((evt.type === "draw-complete") && this.drawActive) {
      // first unsuspend layers on draw-complete event
      // set timeout, needed for point element specificallly as we do not want to start identify method too early
      setTimeout(() => {
        this.mapService.unSuspendLayersToggle();
      }, 800);
    }
  }

  resetTools() {
    const action = this.draw.activeAction as PolygonDrawAction
    console.log('close draw', this.draw, action, isEmpty(action))
    if (!isEmpty(action)) {
      action.complete();
      this.draw.activeAction = null;
    }

    this.extracDisabled = true;
    this.graphic = null;
    this.calculatedUnits = null;
    this.drawActive = false;
    this.view.graphics.removeAll();
    this.stepper.reset();

    console.log("EVENTS", this.eventHandlers);

    //reset eventHandler events
    this.removeEventHandlers();
  }

  //remove eventHandlers
  removeEventHandlers() {
    this.eventHandlers.forEach((event) => {
      event.remove();
    });
    this.eventHandlers = [];
  }


  ngOnDestroy() {
    console.log('DESTROY 3D EXTRACT');
    this.subscription.unsubscribe();
    this.cancelJob(this.jobId)
    this.resetTools();
    this.draw.destroy();
  }

}
