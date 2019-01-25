import { Injectable } from '@angular/core';

import { MapOptions } from '../../options';
import { MapService } from '../../map.service';
import { QuarterLayersMeta } from './QuarterLayersMeta';

import FeatureLayer = require("esri/layers/FeatureLayer");

import findKey from 'lodash-es/findKey';
import pick from 'lodash-es/pick';
import forIn from 'lodash-es/forIn';

import { Observable } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

@Injectable()
export class QuartersLayersService {
	quartersLayers: FeatureLayer;
	quarterLayersMeta: Observable<any>;

  constructor(private mapService: MapService) { }

  addCustomLayers(queryParams, snapshotUrl) {
		//using lodash find and pick themeLayer from options
    const themeName = findKey(MapOptions.themes, { "id": snapshotUrl.path });
    const themeLayers = pick(MapOptions.themes, themeName)[themeName]["layers"];
    const map = this.mapService.returnMap();

    //all theme layers will be added to common group layer
    const mainGroupLayer = this.mapService.initGroupLayer(themeName + 'group', 'Kvartalinė renovacija', 'show');
    map.add(mainGroupLayer);

    forIn(themeLayers, (layer, key) => {
      const response = this.mapService.fetchRequest(layer.dynimacLayerUrls)
      const popupEnabled = false;

      //create group and add all grouped layers to same group, so we could manage group visibility
      const groupLayer = this.mapService.initGroupLayer(key + 'group', 'Vilniaus miesto kvartalai', 'hide-children');
      mainGroupLayer.add(groupLayer);
      //add feature layer with opacity 0
      this.mapService.pickCustomThemeLayers(response, layer, key, queryParams, groupLayer, 0);

			this.mapService.pickMainThemeLayers(layer, key, queryParams, popupEnabled, groupLayer);

			this.addQuarterLayersMeta(response);
		});

    //set raster layers
    const rasterLayers = this.mapService.getRasterLayers();
    this.mapService.setRasterLayers(rasterLayers);
  }

	addQuarterLayersMeta(mapLayersMeta$) {
		this.quarterLayersMeta = mapLayersMeta$.pipe(
			tap((res) => console.log('tap', res)),
			map((res: any)=> {
				return res.layers.map((layer) => {
					const {id, name, description} = layer;
					return {id, name, description };
				})
			}),
			tap((res) => console.log('tap', res))
		)
		// .subscribe((layers: QuarterLayersMeta[]) => {
		// 	this.quarterLayersMeta = layers;
		// 	console.log('QuarterLayersMeta', layers)
		// })
	}

	// add quarters layers cache
	setQuartersLayer(layer) {
		if (!this.quartersLayers) {
			this.quartersLayers =  layer;
		}
	}

}
