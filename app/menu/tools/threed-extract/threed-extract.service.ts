import { Injectable } from '@angular/core';

import { MapService } from '../../../map.service';
import { MenuToolsService } from '../../menu-tools.service';
import { MapOptions } from '../../../options';
import { Symbols } from '../../symbols';

import { leaveEnterTransition } from '../../../animations/leaveEnter-transition'

import Geoprocessor = require('esri/tasks/Geoprocessor');
import Draw = require('esri/views/2d/draw/Draw');
import PolygonDrawAction = require('esri/views/2d/draw/PolygonDrawAction');
import Graphic = require('esri/Graphic');
import Polygon = require('esri/geometry/Polygon');
import FeatureSet = require('esri/tasks/support/FeatureSet');
import geometryEngine = require('esri/geometry/geometryEngine');

@Injectable()

export class ThreeDExtractService {
	//dojo draw events handlers Array
	private eventHandlers = [];
	draw: Draw;
	view: any;

	constructor(
		private mapService: MapService,
		private menuToolsService: MenuToolsService
	) { }

	initDraw(view) {
		this.view = view;
		this.draw = new Draw({
			view
		});
	}

	deactivateAndDisable(evt: Event, drawActive: boolean) {
		// on complete remove class
		// check if drawActive -> unsuspend
		if ((evt.type === "draw-complete") && drawActive) {
			// first unsuspend layers on draw-complete event
			// set timeout, needed for point element specificallly as we do not want to start identify method too early
			setTimeout(() => {
				this.mapService.unSuspendLayersToggle();
			}, 800);
		}
	}

	drawPolygon(evt, ended = false, drawActive: boolean) {
		//on complete remove class
		this.deactivateAndDisable(evt, drawActive);

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

}
