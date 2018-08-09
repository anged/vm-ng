import { Injectable } from '@angular/core';

import { MapOptions } from '../../options';
import { MapService } from '../../map.service';
import { MenuService } from '../../menu/menu.service';

import findKey from 'lodash-es/findKey';
import pick from 'lodash-es/pick';
import forIn from 'lodash-es/forIn';

@Injectable()
export class ViewService {

  constructor(
    private mapService: MapService,
    private menuService: MenuService
  ) { }


  //initiate MapView
  initView() {

  }

  // create themes' group layer and add all layers to it
  createThemeLayers(snapshotUrl: string, queryParams) {
    const rasterLayers = this.mapService.getRasterLayers();
    //create theme main layers grouped
    const themeGroupLayer = this.mapService.initGroupLayer("theme-group", "Main theme layers", "show");

    //using lodash find and pick themeLayer from options
    let themeName = findKey(MapOptions.themes, { "id": snapshotUrl });
    let themeLayers = pick(MapOptions.themes, themeName)[themeName]["layers"];

    forIn(themeLayers, (layer, key) => {
      const response = this.mapService.fetchRequest(layer.dynimacLayerUrls);
      this.mapService.pickMainThemeLayers(response, layer, key, queryParams);
    });

    //set raster layers
    this.mapService.setRasterLayers(rasterLayers);
  }

  //create sub Layers
  //TODO remove sub layers and create custom widget with layers search
  createSubLayers(queryParams) {
    //count sub layers and add to map if required
    const responseFeatures = this.mapService.fetchRequest(MapOptions.mapOptions.staticServices.commonMaps);
    const sublayers = this.mapService.addToMap(responseFeatures, queryParams);

    if (queryParams.allLayers && (queryParams.identify === "allLayers")) {
      //set sublayers state as we will load all layers layer on map
      this.menuService.setSubLayersState();
    };
  }

}
