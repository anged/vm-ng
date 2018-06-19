import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { MapOptions } from '../../options';
import { MapService } from '../../map.service';
import { PopupTemplates } from '../../services/identify/popup-templates';


@Injectable()
export class MapDefaultService {
  //dinamic layers array
  dynamicLayersArray: any[] = [];

  //url array
  urlArray: string[] = [];

  constructor(private http: HttpClient, private mapService: MapService) { }

  getUrls(): string[] {
    return this.urlArray;
  }

  //return Dynimac Layers
  initDefaultDynamicLayers(themeServiceUrl: any, id: string, name: string, opacity: number, raster: boolean = false): any {
    let dynamicLayer = this.mapService.initDynamicLayer(themeServiceUrl, id, name, opacity);
    dynamicLayer["isRaster"] = raster;
    return dynamicLayer;
  }

  //get service based on theme
  getDefaultDynamicLayers(urlTheme: string): any[] {
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
    let layersArr: any[] = [];
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
    let reg = /(\d+)[.](\d+)[.](\d+)\s.*/; //regex: match number with . char, clear everything else
    let feature = result.feature,
      content = " ",
      layerName = result.layerName,
      attributes = feature.attributes;

    feature.attributes.layerName = layerName;

    for (let resultAtr in attributes) {
      if (attributes.hasOwnProperty(resultAtr)) {
        //Filter specific string values
        if (!(resultAtr.toLowerCase() == "objectid" || resultAtr == "layerName" || resultAtr.match(/shape/i) || resultAtr == "Class value" || resultAtr == "Pixel Value" || resultAtr.match(/count/i) //TEMP check for raster and other str properties, use match case insensitive where possible
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
            //check if url contains http or https  + :// string with regex, TODO refactor
            if (attributeResult.match("^https?://", "i")) {
              content += `<p><span>${resultAtr}</br></span><a href='${attributeResult}' target='_blank'>${attributeResult}</a><p>`;
            } else {
              content += "<p><span>" + resultAtr + "</br></span>" + attributeResult + "<p>";
            }

          }
        } else if (resultAtr == "Class value" || resultAtr == "Pixel Value") {
          //TEMP check for raster properties 	and add custom msg
          content = '<p class="raster">Išsamesnė sluoksnio informacija pateikiama Meniu lauke <strong>"Žymėjimas"</strong></p>';
        }

      }
    }
    return content;
  }

}
