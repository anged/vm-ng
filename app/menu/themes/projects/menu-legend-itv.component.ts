import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { MapService } from '../../../map.service';
import { MapOptions } from '../../../options';

import  Legend = require ('esri/widgets/Legend');
import on = require("dojo/on");

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'menu-legend-itv',
    template: `
      <div>
        <p>Sutartiniai ženklai:</p>
        <a (click)="closeToggle()" class="button close animate" title="Uždaryti">✕</a>
        <div id="legend-list" class="inner">
          <div class="layer-group one-service">
            <p>Investicinių projektų būsena</p>
          </div>
          </div>
      </div>
    `
})
export class MenuLegendItvComponent  implements OnInit, OnDestroy {
  @Input() viewLegend: any;
  itvLayers: any;
  subscription: Subscription;

  // Observable  source, start from empty ("") string
  private layersObs = new BehaviorSubject<any>(true);
  // Observable item stream
  layersItem = this.layersObs.asObservable();

  constructor(private _mapService: MapService) {}

  //filter 6 itv layers by type "Būsena" (points and lines)
  filterItvLayers() {
    return this._mapService.returnFeatureLayers().filter((a) => {
      return a.title === "itv-feature-layer-0" || a.title === "itv-feature-layer-2" || a.title === "itv-feature-layer-4" || a.title === "itv-feature-layer-1" || a.title === "itv-feature-layer-3" || a.title === "itv-feature-layer-5";
    })
  }

  initLegend() {
    this.itvLayers = this.filterItvLayers();
    //console.log("itv layeriai",  this.itvLayers)

    let renderedLayers: any[] = [];
    let layersLoadedNumber: number = 0; //count loaded itv layers , 3 layers total
    this.itvLayers.map(layer => {
      //wait till layerview is rendered than susbscribe
      //TODO add layer view event and subscribe to event in map component
      layer.on("layerview-create", (event) =>{
          layersLoadedNumber +=1;
          renderedLayers.push(event.layerView.layer);
          //itv legend exists of 6 layers items, total 6 symbols
          //when 3rd layer loaded - subsrcibe
          if (layersLoadedNumber === 6) {
            //console.log(renderedLayers);
            this.layersObs.next(renderedLayers);
          }
      });
    });
  }

  closeToggle() {
    window.location.hash = "#";
  }

  //fetchLegend after subscribtion
  fetchLegend(renderedLayers) {
    let itvLayers;
    let sym4, sym2, sym0;
    itvLayers = renderedLayers.reverse().map(layer => {
      //show legend of layers att all scale, overright current scale
      //TODO change rednered symbol to point symbol for lines
      //layer.minScale = 0;
      //layer.maxScale = 0;
      //console.log(layer.title);
      if (layer.title === "itv-feature-layer-4") {
        //set renderer title
        layer.renderer.label ="Baigti projektai"
        sym4 = layer.renderer.symbol;
      } else if (layer.title === "itv-feature-layer-2") {
        layer.renderer.label ="Vykdomi projektai"
        sym2 = layer.renderer.symbol;
      } else if (layer.title === "itv-feature-layer-0") {
        layer.renderer.label ="Nepradėti projektai";
        sym0 = layer.renderer.symbol;
      } else if (layer.title === "itv-feature-layer-5") {
        layer.renderer.label ="Baigti projektai";
        layer.renderer.symbol = sym4;
      } else if (layer.title === "itv-feature-layer-3") {
        layer.renderer.label ="Vykdomi projektai";
        layer.renderer.symbol = sym2;
      } else if (layer.title === "itv-feature-layer-1") {
        layer.renderer.label ="Nepradėti projektai";
        layer.renderer.symbol = sym0;
      }
      layer.labelsVisible = true;
      //set layer title to empty string
      layer.title = "";
      return layer
    });
    //console.log(itvLayers)
    return new Legend({
        view: this.viewLegend,
        container: "legend-list",
        layerInfos: [{
          layer: itvLayers[2]
        }, {
          layer: itvLayers[1]
        }, {
          layer: itvLayers[0]
        }, {
          layer: itvLayers[5]
        }, {
          layer: itvLayers[4]
        }, {
          layer: itvLayers[3]
        }
      ]
    });
  }

  ngOnInit() {
    this.initLegend();
    this.subscription = this.layersItem.subscribe(renderedLayers => {
      //console.log("renderedLayers", renderedLayers);
      //console.log("type", typeof(renderedLayers));
      if ( typeof(renderedLayers) === "object") {
        this.fetchLegend(Array.from(renderedLayers));
      }
      //if layers are already rendered do not need to susbscribe, so fetch legend
      //check only if first layer is rendered
      let firstLayer: boolean = true;
      this.itvLayers.map(layer => {
        if ((typeof(layer.renderer) == "object") && (firstLayer)) {
          //console.log(layer.renderer)
          //console.log(typeof(layer.renderer) )
            //check if legend wasn't already fetched by subscribtion by evaluating label string, if emtpy
            if (layer.renderer.label === "") {
              this.fetchLegend(this.itvLayers);
            }
            firstLayer = false;
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
