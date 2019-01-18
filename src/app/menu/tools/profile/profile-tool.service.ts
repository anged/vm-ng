import { Injectable } from '@angular/core';

import { MapService } from '../../../map.service';
import { MapOptions } from '../../../options';
import { MenuToolsService } from '../../menu-tools.service';
import { Symbols } from '../../symbols';

// import Geoprocessor = require('esri/tasks/Geoprocessor');
// import Draw = require('esri/views/2d/draw/Draw');
// import Graphic = require('esri/Graphic');
// import FeatureSet = require('esri/tasks/support/FeatureSet');
// import geometryEngine = require('esri/geometry/geometryEngine');

import { loadModules } from 'esri-loader';
import esri = __esri;

import * as Raven from 'raven-js';

@Injectable()
export class ProfileToolService {
	toolActive = false;
  geo: esri.Geoprocessor;
  view: esri.MapView;
  chartData: any;
  draw: esri.Draw;
  graphic: esri.Graphic;
  job: IPromise<any>;
	calculatedUnits: string;

  constructor(
    private mapService: MapService,
    private menuToolsService: MenuToolsService
  ) { }

	closeProfile() {
		return this.toolActive = false;
	}

	toggleProfile() {
		return this.toolActive = !this.toolActive;
	}

  async initDraw(view) {
		const [Draw] = await loadModules([
			'esri/views/2d/draw/Draw'
		]);
    this.view = view;
    this.draw = new Draw({
      view
    });
    return this.draw;
  }

  async initGeoprocessor(view) {
		const [Geoprocessor] = await loadModules([
			'esri/tasks/Geoprocessor'
		]);
    const url = MapOptions.mapOptions.staticServices.profileGP.url;
    this.geo = new Geoprocessor({
      url,
      outSpatialReference: view.spatialReference
    });
    return this.geo;
  }

  async createPolylineGraphic(evt, ended = false) {
		const [geometryEngine] = await loadModules([
			'esri/geometry/geometryEngine'
		]);
    this.deactivateAndDisable(evt);
    this.view.graphics.removeAll();

    const polyline = {
      type: "polyline", // autocasts as Polyline
      paths: evt.vertices,
      spatialReference: this.view.spatialReference
    };
    const graphic = await this.menuToolsService.createGeometry(polyline, Symbols.lineSymbol);

    this.graphic = graphic;
    this.view.graphics.add(graphic);
    if (ended) {
      return this.submitExtractJob();
    }

		// calculate the area of the polygon
		let line = geometryEngine.planarLength(graphic.geometry, "kilometers");
		const lastIndex = polyline.paths.length - 1;
		this.labelLinesAndPoints("line", polyline.paths[lastIndex], line, ended);
  }

	// Label text
	async labelLinesAndPoints(geometryType: string, points, geometry = undefined, ended = false) {
		const endString = ended ? "" : " (užbaigti dvigubu paspaudimu)";
		let text: string;
		geometryType === "line" ? text = geometry.toFixed(3) + " km" + endString : text = `x: ${points[1].toFixed(2)}, y: ${points[0].toFixed(2)}`;
		geometryType === "line" ? this.calculatedUnits = geometry.toFixed(3) + " km" : this.calculatedUnits = `x: ${points[1].toFixed(2)}, <br>y: ${points[0].toFixed(2)}`
		const graphic = await this.menuToolsService.createLineOrPointLabelGraphic(points, text, this.view);
		this.view.graphics.add(graphic);
	}

  deactivateAndDisable(evt) {
    // on complete remove class
    if (evt.type === "draw-complete") {
      // first unsuspend layers on draw-complete event
      // set timeout, needed for point element specificallly as we do not want to start identify method too early
      setTimeout(() => {
        this.mapService.unSuspendLayersToggle();
      }, 800);
    }

  }

  async submitExtractJob() {
		const [FeatureSet] = await loadModules([
			'esri/tasks/support/FeatureSet'
		]);
		const featureSet = new FeatureSet();
    let params = {
     // TODO expand choice list, curent list: [ , FINEST, 1m ]
     DEMResolution: 'FINEST', //default '1m'
     returnZ: true
    };

    featureSet.features = [this.graphic];
    params[MapOptions.mapOptions.staticServices.profileGP.params.name] = featureSet;
    this.job = this.geo.execute(params);
    return this.job.then((res) => {
      if (res.jobStatus !== 'job-failed') {
        return res.results[0].value.features[0];
      } else {

      }

    }).catch(function(err) {
			Raven.captureMessage('VP warn: profile running out of extent ' + err, {
			  level: 'warn' // one of 'info', 'warning', or 'error'
			});
      console.warn('VP warn', err);
			return err;
    });
  }

}
