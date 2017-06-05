import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';

import { MapOptions } from '../../options';
import { MapService } from '../../map.service';
import { PopupTemplates } from '../../services/identify/popup-templates';


@Injectable()
export class MapDefaultService {

  private themeName: string;

  //dinamic layers array
  dynamicLayersArray: any[] = [];

  //url array
  urlArray: string[] = [];

  constructor(private http: Http, private mapService: MapService) { }

  getUrls(): string[] {
    return this.urlArray;
  }

  //return Dynimac Layers
  initDefaultDynamicLayers(themeServiceUrl: any, id: string, name: string, opacity: number, raster: boolean = false):any {
    let dynamicLayer =  this.mapService.initDynamicLayer(themeServiceUrl, id, name, opacity);
    dynamicLayer["isRaster"] = raster;
    return dynamicLayer;
  }

  //get service based on theme
  getDefaultDynamicLayers(urlTheme: string):any[] {
    let themes: any = MapOptions.themes;
    for (let theme in themes) {
      //if hasOwnProperty and if not custom theme
      if ((themes.hasOwnProperty(theme)) && (!themes[theme].custom)) {
        let themeId = themes[theme].id; //get unique theme id
        if (themeId === urlTheme) {
          return this.returnDynamicLayersArray(theme);
        }
      }
    }
  }

  returnDynamicLayersArray(themeId: string): any[] {
    let layers = MapOptions.themes[themeId].layers;
    let layersArr: any[]= [];
    for (let layer in layers) {
      //console.log("layeris", layers)
      if (layers.hasOwnProperty(layer)) {
        let url = layers[layer].dynimacLayerUrls; //get url
        //init dynaimc layer bases on url and push it to array
        let id = layer; // get id
        let name = layers[layer].name; //get name
        let opacity = layers[layer].opacity;
        let raster = layers[layer].isRaster;
        //do not push service with Raster
        if (!raster) {
          this.urlArray.push(url);
        }
        //opacity ? opacity : opacity = 1;
        layersArr.push(this.initDefaultDynamicLayers(url, id, name, opacity, raster));
      }
    }
    //console.log("MASYVAS", layersArr)
    //console.log("URLS", this.urlArray);
    return layersArr;
  }

  //validate ArcGis date string
  isValidDate(dateStr, reg) {
		return dateStr.match(reg) !== null;
	};

  getVisibleLayersContent(result): string {
    let  reg = /(\d+)[.](\d+)[.](\d+)\s.*/; //regex: match number with . char, clear everything else
    let feature = result.feature,
      content = " ",
      layerName = result.layerName,
      attributes = feature.attributes;

    feature.attributes.layerName = layerName;

    for (let resultAtr in attributes) {
      if (attributes.hasOwnProperty(resultAtr)) {
        //console.log(resultAtr);
        if (!(resultAtr == "OBJECTID" || resultAtr == "layerName" || resultAtr == "SHAPE" || resultAtr == "SHAPE.area" || resultAtr == "Shape.area" || resultAtr == "SHAPE.STArea()" || resultAtr == "Shape" || resultAtr == "SHAPE.len" || resultAtr == "Shape.len" || resultAtr == "SHAPE.STLength()" || resultAtr == "SHAPE.fid" ||
        resultAtr == "Class value" || resultAtr == "Pixel Value"  || resultAtr == "Count_" //TEMP check for raster properties
           )) { //add layers attributes that you do not want to show
          //AG check for date string
          if (this.isValidDate(attributes[resultAtr], reg)) {
            let attributeDate = attributes[resultAtr];
            content += "<p><span>" + resultAtr + "</br></span>" + attributes[resultAtr].replace(reg, '$1-$2-$3') + "<p>";
          } else {
            var attributeResult = attributes[resultAtr];
            if (attributeResult !== null) { //attributes[resultAtr] == null  equals to (attributes[resultAtr]  === undefined || attributes[resultAtr]  === null)
              if ((attributeResult === " ") || (attributeResult === "Null")) {
                attributeResult = "-";
              }
            } else {
              attributeResult = "-";
            }
            content += "<p><span>" + resultAtr + "</br></span>" + attributeResult + "<p>";
          }
        } else if (resultAtr == "Class value" || resultAtr == "Pixel Value") {
          //TEMP check for raster properties 	and add custom msg
          content = '<p class="raster">Išsamesnė sluoksnio informacija pateikiama Meniu lauke <strong>"Žymėjimas"</strong></p>';
        }

      }
    }
    return content;
  }

  getVisibleLayersIds(view) {
    //small fix: add layer id that doen't exist, for example 999, in order to prevent all layers identification when all lists are turned off
    let ids: number[] = [999];
    let viewScale = view.scale;

    //console.log("layerViews", view.layerViews)
    view.layerViews.items.map( firstLayer => {
    //console.log("IDS", firstLayer)
    //do not identify layer if it is Raster
    if ((firstLayer.visible) && (!firstLayer.layer.isRaster)) {
      let subLayers = firstLayer.layer.sublayers.items;
      //console.log("subLayer", subLayers)
      subLayers.map((subLayer)=>{
        let minScale = subLayer.minScale;
        let maxScale = subLayer.maxScale;
        //add number to fit viewScale, because 0 in Esri logic means layer is not scaled
        ((minScale === 0) )? minScale = 99999999 : minScale;

        // console.log(subLayer.minScale , viewScale , subLayer.maxScale)
        // console.log(minScale , viewScale , maxScale)
        //if layer is visible and in view scale
        if ((subLayer.visible) && (maxScale < viewScale) && (viewScale < minScale)) {
          //check if sublayer has subsublayers
          if (subLayer.sublayers) {
            //3 layer if exist
            let subsublayers = subLayer.sublayers.items;
            subsublayers.map(subsublayer => {
              let subMinScale = subsublayer.minScale;
              let subMaxScale = subsublayer.maxScale;
              ((subMinScale === 0) ) ? subMinScale = 99999999 : subMinScale;
              //if layer is visible and in view scale
              if ((subsublayer.visible) && (subMaxScale < viewScale) && (viewScale < subMinScale)) {
                 ids.push(subsublayer.id);
               }
            });
          }
          //else push id
          else {
            ids.push(subLayer.id);
          }
        }
      })
    }
    })
    //console.log("FINAL IDS", ids)
    return ids;
  }


}
