import { Component, OnInit } from '@angular/core';

import { MapService } from '../map.service';
import { MapDefaultService } from '../themes/default/map-default.service';
import { MenuService } from './menu.service';
import { IdentifyService } from '../services/identify/identify.service';
import { MapOptions } from '../options';

@Component({
  selector: 'menu-sub-layers',
  template: `
      <div>
        <p>Papildomi sluoksniai:</p>
        <div id="filters-button">
          <button class="animate" name="button" type="button" (click)="toggleSubState()">
            <svg class="animate" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 42 42">
            <polygon points="42,19 23,19 23,0 19,0 19,19 0,19 0,23 19,23 19,42 23,42 23,23 42,23 "></polygon>
            </svg>
            Pridėti sluoksnį
            <!---->
          </button>
        </div>
      </div>
    `
})
export class MenuSubLayersComponent implements OnInit {
  subLayersActive: boolean = false;
  toggleNumber: number = 1;
  subListWidget: any;

  constructor(private mapService: MapService, private mapDefaultService: MapDefaultService, private menuService: MenuService, private identify: IdentifyService) { }

  toggleSubState() {

    this.subLayersActive = this.menuService.updateSubState();
    //console.log("SUB", this.subLayersActive)
    if (this.toggleNumber % 2) {
      //console.log('create');
      setTimeout(() => {
        this.addSubList();
        this.toggleNumber += 1;
      }, 500);
    } else if (!(this.toggleNumber % 2) && (this.toggleNumber > 1)) {
      //console.log('destroy');
      this.subListWidget.destroy();
      this.toggleNumber += 1;
    }
  }

  addSubList() {
    let view = this.mapService.getView();
    let map = this.mapService.returnMap();
    map.layers.items = this.menuService.listModeSelection("all-layers", map.layers.items);
    this.subLayersActive ? this.subListWidget = this.mapService.initSubLayerListWidget(view, map) : "";
    this.subListWidget.operationalItems.items["0"].children.forEach(child => {
      child.open = true;
      }
    );
  }

  ngOnInit() {
    let view = this.mapService.getView();
    //console.log("VIEW", view);
    let subDynamicLayers = this.mapService.initDynamicLayer("http://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Bendras/MapServer", "all-layers", "Papildomų sluoksnių įjungimas");
    let map = this.mapService.returnMap();
    map.add(subDynamicLayers);
    map.layers.items = this.menuService.listModeSelection("theme", map.layers.items);
  }
}
