import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { MapService } from '../map.service';
import { ToolsNameService } from './tools-name.service';
import { MapOptions } from '../options';
import { Utils } from '../services/utils/utils';

@Component({
  selector: 'menu-layers',
  template: `
   <div class="menu-header">
			 <p>Temos sluoksniai:</p>
    <a (click)="closeToggle()" class="button close animate" title="Uždaryti">✕</a>
		</div>
		<perfect-scrollbar>
			<div class="layers-wrapper">
				<div id="layer-list" #list class="inner menu-nav-content">
				</div>
				<div id="sub-layers-list">
		
				</div>
			</div>
		</perfect-scrollbar>
  `
})
export class MenuLayersComponent implements OnInit, OnDestroy {
  @ViewChild('list') list: ElementRef;
  name: string;
  isChecked = true;
  listWidget: any;
  viewCreateEvent: any;
  listEvent: any;

  constructor(
    private mapService: MapService,
    private toolsNameService: ToolsNameService
  ) { }

  toggleLayerVisibility(event) {
    this.isChecked = event;
    this.isChecked ? this.mapService.returnFeatureLayers().map(feature => { feature.visible = true }) : this.mapService.returnFeatureLayers().map(feature => { feature.visible = false; });
  }

  closeToggle() {
    window.location.hash = "#";
  }

  ngOnInit() {
    // add temp delay to get layers change to Observable
    setTimeout(() => {
      this.name = MapOptions.themes.itvTheme.name;
    }, 400);

    // init layers list widget
    const view = this.mapService.getView();
    const map = this.mapService.returnMap();
    //console.log('OnInit Layers')
    view.when(() => {
      // reorder layers in map and view
      // allLayers layer must be always last in map array,
      // as we are hiding layer list manualy with css
      // as we will be using static component in theme
      this.viewCreateEvent = view.on("layerview-create", (event) => {
        //console.log('ONN', this.listWidget)
        const index = map.layers.length - 1;
        //console.log('%c LOADED', "color: red; font-size: 18px",event.layer.id, map.layers.items.length, event, map)
        // reorder only if allLayers layer comes before theme layers
        if (index > 0) {
          const subLayer = map.findLayerById("allLayers");
          if (typeof subLayer !== undefined) {
            map.reorder(subLayer, index);

            // simply activate :target speudo class with location href
            Utils.setMenuLayersAnchor();
          }

        }

        // set tool name Obs, to close tools boxes if opened
        this.toolsNameService.setCurentToolName('');
        //this.cdr.detectChanges();
      });

      this.listWidget = this.mapService.initLayerListWidget(view, this.list.nativeElement);

      // TODO remove event on destroy
      this.listEvent = this.listWidget.on('trigger-action', (event) => {
        this.mapService.updateOpacity(event);
      });
    });
  }

  ngOnDestroy() {
    this.listWidget.destroy();
    this.viewCreateEvent.remove();
    this.listEvent.remove();
  }
}
