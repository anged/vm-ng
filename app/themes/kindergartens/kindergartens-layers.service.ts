import { Injectable } from '@angular/core';

import { MapOptions } from '../../options';
import { MapService } from '../../map.service';
import { MapKindergartensService } from './map-kindergartens.service';

import findKey from 'lodash-es/findKey';
import pick from 'lodash-es/pick';
import forIn from 'lodash-es/forIn';

@Injectable()
export class KindergartensLayersService {

  constructor(private mapService: MapService, private mapKindergartensService: MapKindergartensService) { }

  addCustomLayers(queryParams, snapshotUrl) {
		//using lodash find and pick themeLayer from options
    const themeName = findKey(MapOptions.themes, { "id": snapshotUrl.path });
    const themeLayers = pick(MapOptions.themes, themeName)[themeName]["layers"];
    const map = this.mapService.returnMap();

    //all theme layers will be added to common group layer
    const mainGroupLayer = this.mapService.initGroupLayer(themeName + 'group', 'Ikimokylinio ugdymo įstaigos', 'show');
    map.add(mainGroupLayer);

    forIn(themeLayers, (layer, key) => {
      const response = this.mapService.fetchRequest(layer.dynimacLayerUrls)
      const popupEnabled = false;

      //create group and add all grouped layers to same group, so we could manage group visibility
      const groupLayer = this.mapService.initGroupLayer(key + 'group', 'Ikimokylinio ugdymo įstaigos', 'hide-children');
      mainGroupLayer.add(groupLayer);
      this.mapService.pickMainThemeLayers(layer, key, queryParams, popupEnabled, groupLayer);

      //add feature layer with opacity 0
      this.mapService.pickCustomThemeLayers(response, layer, key, queryParams, groupLayer, 0, 'simple-marker');

			//get main info data to dataStore
			//send each request after previous one
			this.mapKindergartensService.getAllQueryData(layer.dynimacLayerUrls + '/4', 'elderates', ['ID', 'LABEL']).then(() => {
				this.mapKindergartensService.getAllQueryData(layer.dynimacLayerUrls + '/5', 'mainInfo', ['GARDEN_ID', 'LABEL', 'EMAIL', 'PHONE', 'FAX', 'ELDERATE', 'ELDERATE2','ELDERATE3', 'ELDERATE4', 'SCHOOL_TYPE']).then(() => {
					this.mapKindergartensService.getAllQueryData(layer.dynimacLayerUrls + '/6', 'info', ['DARZ_ID', 'LAN_LABEL', 'TYPE_LABEL', 'CHILDS_COUNT', 'FREE_SPACE']).then(() => {
						this.mapKindergartensService.getAllQueryData(layer.dynimacLayerUrls + '/7', 'summary', ['DARZ_ID', 'CHILDS_COUNT', 'FREE_SPACE']);
					});
				});
			});
    });

    //set raster layers
    const rasterLayers = this.mapService.getRasterLayers();
    this.mapService.setRasterLayers(rasterLayers);
  }

}
