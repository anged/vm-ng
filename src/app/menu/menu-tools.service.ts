import { Injectable } from '@angular/core';

import { MapOptions } from '../options';

// import Print = require('esri/widgets/Print');
// import Graphic = require('esri/Graphic');
// import Point = require('esri/geometry/Point');
// import GeometryService = require('esri/tasks/GeometryService');
// import TextSymbol = require('esri/symbols/TextSymbol');

import { loadModules } from 'esri-loader';
import esri = __esri;

@Injectable()
export class MenuToolsService {

	// current selected tool containing draw feature
	currentDrawTool = '';

  constructor() { }

	setCurrentDrawTool(tool: string) {
		return this.currentDrawTool = tool;
	}

  async initPrint(view) {
		const [Print] = await loadModules([
			'esri/widgets/Print'
		]);
    return new Print({
      view: view,
      printServiceUrl: MapOptions.mapOptions.staticServices.printServiceUrl,
      container: "print-menu"
    });
  }

  async createGeometry(geometry, symbol) {
		const [Graphic] = await loadModules([
			'esri/Graphic'
		]);
    return new Graphic({
      geometry: geometry,
      symbol: symbol
    });
  }

  async createAreaLabelGraphic(geometry, area, ended, units = 'km²') {
		const [Graphic, TextSymbol] = await loadModules([
			'esri/Graphic',
			'esri/symbols/TextSymbol'
		]);
    const endString = ended ? "" : " (užbaigti dvigubu paspaudimu)";
    return new Graphic({
      geometry: geometry.centroid,
      symbol: {
        type: "text",
        color: "white",
        haloColor: "black",
        haloSize: "1px",
        text: `${area.toFixed(4)} ${units} ${endString}`,
        xoffset: 3,
        yoffset: 3,
        font: { // autocast as Font
          size: 10,
          family: "sans-serif"
        }
      } as any as esri.TextSymbol
    });
  }

  async createLineOrPointLabelGraphic(points, text, view) {
		const [Graphic, Point] = await loadModules([
			'esri/Graphic',
			'esri/geometry/Point'
		]);
    return new Graphic({
      geometry: {
        type: "point", // autocasts as /Point
        x: points[0],
        y: points[1],
        spatialReference: view.spatialReference
      } as esri.Point,
      symbol: {
        type: "text",
        color: "white",
        haloColor: "black",
        haloSize: 6,
        text: text,
        xoffset: 3,
        yoffset: 12,
        font: { // autocast as Font
          size: 10,
          family: "sans-serif"
        }
      } as any as esri.TextSymbol
    });
  }

  async addGeometryService(url) {
		const [GeometryService] = await loadModules([
			'esri/tasks/GeometryService'
		]);
    return new GeometryService(url);
  }
}
