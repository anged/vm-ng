import { Injectable } from '@angular/core';

import { BASEMAPS } from './basemaps.ts'


@Injectable()
export class MapWidgetsService {

  //DEFAULT basemap
  activeBasemap: string = "base-dark";

  constructor() {}

  returnBasemaps(): any[] {
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

  //add current basemap visibilty
  filterBasemap(activeBasemMapId: string, view: any) {
    view.map.basemap.baseLayers.items.map((item) => {
      if (item.id === activeBasemMapId) {
        item.visible = true;
        activeBasemMapId === "base-dark"
          ? document.getElementsByClassName("container-fluid")[0].className += " dark"
          : document.getElementsByClassName("container-fluid")[0].classList.remove("dark");
      } else {
        item.visible = false;
      }
    })
  }

}
