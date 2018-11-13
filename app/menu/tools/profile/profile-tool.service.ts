import { Injectable } from '@angular/core';

import { MapService } from '../../../map.service';
import { MapOptions } from '../../../options';
import { MenuToolsService } from '../../menu-tools.service';
import { Symbols } from '../../symbols';

import Geoprocessor = require('esri/tasks/Geoprocessor');
import Draw = require('esri/views/2d/draw/Draw');
import Graphic = require('esri/Graphic');
import FeatureSet = require('esri/tasks/support/FeatureSet');

@Injectable()
export class ProfileToolService {
  geo: Geoprocessor;
  view: any;
  chartData: any;
  draw: Draw;
  graphic: Graphic;
  featureSet = new FeatureSet();
  job: IPromise<any>

  constructor(
    private mapService: MapService,
    private menuToolsService: MenuToolsService
  ) { }

  initDraw(view): Draw {
    this.view = view;
    this.draw = new Draw({
      view
    });
    return this.draw;
  }

  initGeoprocessor(view) {
    const url = MapOptions.mapOptions.staticServices.profileGP.url;
    this.geo = new Geoprocessor({
      url,
      outSpatialReference: view.spatialReference
    });
    return this.geo;
  }

  createPolylineGraphic(evt, ended = false) {
    this.deactivateAndDisable(evt);
    this.view.graphics.removeAll();

    const polyline = {
      type: "polyline", // autocasts as Polyline
      paths: evt.vertices,
      spatialReference: this.view.spatialReference
    };
    const graphic = this.menuToolsService.createGeometry(polyline, Symbols.lineSymbol);

    this.graphic = graphic;
    this.view.graphics.add(graphic);
    if (ended) {
      return this.submitExtractJob();
    }

  }

  deactivateAndDisable(evt) {
    //on complete remove class
    if (evt.type === "draw-complete") {
      //first unsuspend layers on draw-complete event
      //set timeout, needed for point element specificallly as we do not want to start identify method too early
      setTimeout(() => {
        this.mapService.unSuspendLayersToggle();
      }, 800);
    }

  }

  submitExtractJob() {
    let params = {
     // TODO expand choice list, curent list: [ , FINEST, 1m ]
     DEMResolution: 'FINEST', //default '1m'
     returnZ: true
    };

    this.featureSet.features = [this.graphic];
    params[MapOptions.mapOptions.staticServices.profileGP.params.name] = this.featureSet;
    console.log(params, this.featureSet);
    this.job = this.geo.execute(params);
    return this.job.then((res) => {
      if (res.jobStatus !== 'job-failed') {
        console.log('Profile results', res, res.results[0].value.features[0].geometry.paths[0])
        //this.chartData = res.results[0].value.features[0];
        return res.results[0].value.features[0];
      } else {

      }

    }).catch(function(error) {
      console.warn('VP Warn', error);
    });
  }

}
