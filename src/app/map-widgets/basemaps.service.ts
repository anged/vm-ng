import { Injectable } from '@angular/core';

import { MapOptions } from '../options';
import { BASEMAPS, Basemap } from './basemaps'
import { MapService } from '../map.service';

//import watchUtils = require("esri/core/watchUtils");
import { loadModules } from 'esri-loader';
import esri = __esri;

@Injectable({
	 providedIn: 'root',
})
export class BasemapsService {
  // DEFAULT basemap
  activeBasemap = "base-dark";

  constructor(private mapService: MapService) { }

  returnBasemaps(): Basemap[] {
    return BASEMAPS;
  }

  setActiveBasemap(name: string) {
    this.activeBasemap = name;
  }

  toggleBasemap(id: string, view: any) {
    this.activeBasemap = id;
    this.filterBasemap(id, view);
  }

  returnActiveBasemap() {
    return this.activeBasemap;
  }

  // iniatiate basemaps
  async initBasemaps(map, queryParams = { basemap: null }) {
		const [TileLayer,Basemap] = await loadModules([
			'esri/layers/TileLayer',
			'esri/Basemap'

		]);
    // add  basemap layer
    const basemaps = [];

    BASEMAPS.forEach(async basemap => {
      const baseMapRestEndpoint = MapOptions.mapOptions.staticServices[basemap.serviceName];
      if (queryParams.basemap === basemap.id) {
        this.setActiveBasemap(basemap.id);
        //const visibleBaseMap = await this.mapService.initTiledLayer(baseMapRestEndpoint, basemap.id);
        const visibleBaseMap = 	new TileLayer({
						url: baseMapRestEndpoint,
						id:  basemap.id,
						visible: true
					});
      } else {
        //const hiddenBaseMap = await this.mapService.initTiledLayer(baseMapRestEndpoint, basemap.id, false);
        const hiddenBaseMap = 	new TileLayer({
						url: baseMapRestEndpoint,
						id:  basemap.id,
						visible: false
					});
        basemaps.push(hiddenBaseMap);
      }

    });
		console.log('basemaps', basemaps)
    map.basemap = new Basemap({
      baseLayers: basemaps,
      title: "Pagrindo žemėlapiai",
      id: "customBasemap"
    });
    // update map instance
    this.mapService.updateMap(map);
    return basemaps;
  }

  // add current basemap visibilty
  filterBasemap(activeBasemMapId: string, view: any) {
    view.map.basemap.baseLayers.items.map((item) => {
      if (item.id === activeBasemMapId) {
        item.visible = true;
        activeBasemMapId === "base-dark"
          ? document.getElementsByClassName("container-fluid")[0].className += " dark"
          : document.getElementsByClassName("container-fluid")[0].classList.remove("dark");
      } else {
        item.visible = false;
        // if active base map is basemapEngineeringUrl, add  another  basemap as well ("base-dark" for example)
        ((this.activeBasemap === "base-en-t") && (item.id === "base-dark"))
          ? item.visible = true
          : void (0);

        ((this.activeBasemap === "base-en-s") && (item.id === "base-map"))
          ? item.visible = true
          : void (0);
      }

    })
  }

}
