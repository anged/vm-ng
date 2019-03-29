import { Injectable } from '@angular/core';

import { MapOptions } from '../../options';
import { MapService } from '../../map.service';

import findKey from 'lodash-es/findKey';
import pick from 'lodash-es/pick';
import forIn from 'lodash-es/forIn';

@Injectable()
export class BuildingsLayersService {

  constructor(private mapService: MapService) { }

  addCustomLayers(queryParams, snapshotUrl) {
		//using lodash find and pick themeLayer from options
    const themeName = findKey(MapOptions.themes, { "id": snapshotUrl.path });
    const themeLayers = pick(MapOptions.themes, themeName)[themeName]["layers"];
    const map = this.mapService.returnMap();

    //all theme layers will be added to common group layer
    const mainGroupLayer = this.mapService.initGroupLayer(themeName + 'group', 'Pastatai', 'show');
    map.add(mainGroupLayer);

    forIn(themeLayers, (layer, key) => {
      const popupEnabled = false;

      //create group and add all grouped layers to same group, so we could manage group visibility
      const groupLayer = this.mapService.initGroupLayer(key + 'group', 'Šildymo sezono reitingas', 'hide-children');
      mainGroupLayer.add(groupLayer);
      //add feature layer with opacity 0
      this.mapService.pickCustomThemeLayers(layer, key, queryParams, groupLayer, 2);

			this.mapService.pickMainThemeLayers(layer, key, queryParams, popupEnabled, groupLayer);
		});

    //set raster layers
    const rasterLayers = this.mapService.getRasterLayers();
    this.mapService.setRasterLayers(rasterLayers);
  }

}
