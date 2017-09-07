import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';

import Map = require("esri/Map");
import Graphic = require("esri/Graphic");
import Point = require("esri/geometry/Point");
import Polyline = require("esri/geometry/Polyline");
import Polygon = require("esri/geometry/Polygon");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");

import MapView = require("esri/views/MapView");
import GroupLayer = require("esri/layers/GroupLayer");
import MapImageLayer = require("esri/layers/MapImageLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import TileLayer = require("esri/layers/TileLayer");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Basemap = require("esri/Basemap");
import LayerList = require("esri/widgets/LayerList");
import on = require("dojo/on");

import IdentifyTask = require("esri/tasks/IdentifyTask");
import IdentifyParameters = require("esri/tasks/support/IdentifyParameters");

import { MapOptions } from './options';
import { PopupTemplates } from './services/identify/popup-templates';
import { ProjectsListService } from './projects-list/projects-list.service';


@Injectable()
export class MapService {
  //array to identify by name selection graphic layers and remove them
  private selectedGraphicNames: string[] = [];
  private selectedGraphicCount: number = 0;

  //selection graphic layer array:
  private allGraphicLayers: any[] = [];

  private featureLayerArr: any[];

  private projectsObs = new Subject();
  projectsItem = this.projectsObs.asObservable();

  private mobile: boolean = false;

  private themeName: string;

  private view: any;

  //visible layers
  visibleLayers: {};

  visibleSubLayerNumber: number = 0;

  private queryParams: any;

  map: any;

  constructor(private http: Http, private projectsService: ProjectsListService) { }

  initMap(options: Object): Map {
    //return new Map(options);
    return new Map();
  }
  viewMap(map: Map): MapView {
    this.view = new MapView({
      //container: this.elementRef.nativeElement.firstChild, // AG good practis
      container: 'map',
      constraints: {
        snapToZoom: false, //When true, the view snaps to the next LOD when zooming in or out. When false, the zoom is continuous.
        rotationEnabled: true  // Disables map rotation
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          position: 'bottom-left',
          // Disables the dock button from the popup
          buttonEnabled: true,
          // Ignore the default sizes that trigger responsive docking
          breakpoint: false
        }
      },
      map: map,
      //center: [25.266, 54.698], // lon, lat
      zoom: 1,
      extent: MapOptions.mapOptions.extent
    });
    return this.view;
  }

  returnQueryParams() {
    return this.queryParams;
  }

  //create GroupLayer
  //listMode Indicates how the layer should display in the LayerList widget
  // listMode value	Description:
  // show:The layer is visible in the table of contents.
  // hide:	The layer is hidden in the table of contents.
  // hide-children:	If the layer is a GroupLayer, hide the children layers from the table of contents.
  initGroupLayer(id: string, name: string, listMode: string) {
    return new GroupLayer({
      id: id,
      title: name,
      listMode: listMode//,
      //visibilityMode: "independent"
    });
  }

  //update view
  updateView(view) {
    return this.view = view;
  }

  getView() {
    return this.view;
  }

  //update map
  updateMap(map) {
    return this.map = map;
  }

  returnMap() {
    return this.map;
  }

  initDynamicLayer(layer: string, id: string = "itv", name: string = "itv", opacity = 1) {
    return new MapImageLayer({
      url: layer,
      id: id,
      outFields: ["*"],
      opacity: opacity,
      title: name
    });
  }

  initGraphicLayer(id: number, scale: number[] = []) {
    return new GraphicsLayer({
      id: "selection-graphic-" + id,
      declaredClass: "selected",
      maxScale: scale["max"],
      minScale: scale["min"]
    });
  }

  initGraphic(type: string, name: String, attr: any, geom, scale: any = "", graphicLayer) {
    return new Graphic({
      attributes: attr,
      geometry: geom,
      popupTemplate: {
        title: this.projectsService.getPopUpTitle(attr),
        //pass selection string to indentify that content is for selected graphic, so Observable must not be used
        content: this.projectsService.getPopUpContent(attr, "selection")
      },
      symbol: this.initSymbol(type),
      layer: graphicLayer
    });
  }

  initSymbol(type: string) {
    let symbol;
    switch (type) {
      case "point":
        symbol = new SimpleMarkerSymbol({
          //color: [251,215,140],
          size: "12px",
          outline: { // autocasts as new SimpleLineSymbol()
            //color: [251,215,140],
            color: [181, 14, 18],
            style: "solid",
            width: 3
          }
        });
        break;
      case "polyline":
        symbol = new SimpleLineSymbol({
          //color: [251,215,140],
          color: [181, 14, 18],
          style: "solid",
          width: 3
        });
        break;
      case "polygon":
        symbol = new SimpleFillSymbol({
          //color: [251,215,140],
          outline: { // autocasts as new SimpleLineSymbol()
            //color: [251,215,140],
            color: [181, 14, 18],
            style: "solid",
            miterLimit: 1,
            width: 3
          }
        });
        break;
    }
    return symbol;
  }

  initTiledLayer(layer: string, name: string, visible: boolean = true): TileLayer {
    return new TileLayer({
      url: layer,
      id: name,
      visible: visible
    });
  }

  initFeatureLayer(layer: String, opacity, index: Number): FeatureLayer {
    return new FeatureLayer({
      url: layer,
      id: 'itv-feature-' + index,
      outFields: ["*"],
      opacity: opacity || 1,
      //definitionExpression: 'Pabaiga=2018',
      title: 'itv-feature-layer-' + index,
      //add popupTemplate
      //popupTemplate: PopupTemplates.itvTemplate
    });
  }

  //count REST layers and only if it's not grouped (not implemented)
  countRestlayers(url: string) {
    return this.http.get(url)
      .map(this.getData)
      .catch(this.handleError);
  }

  getData(res: Response) {
    let jsonResponse = res.json();
    //console.log("jsonResponse", jsonResponse);
    return jsonResponse;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  createFeatureLayers(layersNumber: number, url: String) {
    let i = layersNumber - 1, array = [];
    while (i >= 0) {
      let featureUrl: String = url + "/" + i;
      array.push(this.initFeatureLayer(featureUrl, 1, i));
      i -= 1;
    }
    this.featureLayerArr = array;
    //console.log(array);
    return array;
  }

  returnFeatureLayers() {
    return this.featureLayerArr;
  }

  removeSelectionLayers(map: any): void {
    if (this.allGraphicLayers.length > 0) {
      //remove all graphic from map
      this.allGraphicLayers.forEach(graphic => graphic.removeAll());
      this.allGraphicLayers = [];
    }
  }

  initSelectionGraphic(result, scale, graphicLayer) {
    if (result.geometry.type === "point") {
      return this.initGraphic("point", "selected-feature", result.attributes, result.geometry, scale, graphicLayer);
    }
    if (result.geometry.type === "polyline") {
      return this.initGraphic("polyline", "selected-feature", result.attributes, result.geometry, scale, graphicLayer);
    }
    if (result.geometry.type === "polygon") {
      return this.initGraphic("polygon", "selected-feature", result.attributes, result.geometry, scale, graphicLayer);
    }
  }

  //selection results to graphic by creating new graphic layer
  selectionResultsToGraphic(map: any, results: any, maxScale: any, minScale: any, layer: any, number: number): void {
    // let graphicLayer
    let graphicLayer;
    let graphic;
    //set opacity
    //layer.opacity = 0.9;

    graphicLayer = this.initGraphicLayer(number, { max: maxScale, min: minScale });
    this.allGraphicLayers.push(graphicLayer);

    //console.log("graphicLayer", graphicLayer)
    graphic = this.initSelectionGraphic(results, { max: maxScale, min: minScale }, graphicLayer);
    graphicLayer.add(graphic);
    map.add(graphicLayer);
    //console.log("map", map)

    //watch layer creaton and asign class to svg graphcis
    graphicLayer.on("layerview-create", function(event) {
      // The LayerView for the layer that emitted this event
      //event.layerView.graphicsView.graphics.items["0"].symbol.setAttribute("class", "selected-itv-point");
      //event.layerView.graphicsView._frontGroup.parent.element.className += " selected-itv-point";
      //do not add class and css animation on mobile devices
      if (!this.mobile) {
        setTimeout(function() {
          let node = event.layerView.graphicsView._frontGroup.parent;
          node ? node.element.className += " selected-itv-point" : node;
          //console.log(event.layerView.graphicsView._frontGroup.parent.element.className);
        }, 1000);
      }
    });
  }

  //on map component OnInit center and zoom based on URL query params
  centerZoom(view: any, params: any) {
    let point: number[];
    point = [params.x ? parseFloat(params.x) : view.center.x, params.y ? parseFloat(params.y) : view.center.y];
    //setTimeout(() => {
    view.zoom = params.zoom;

    //center to point adn add spatialReference
    point = new Point({
      x: point[0],
      y: point[1],
      spatialReference: 3346
    });
    view.center = point;
  }

  //on map component OnInit read checked layers params (if exists) and activate  visible layers
  activateLayersVisibility(view: any, params: any, map: any) {
    this.queryParams = params;
    if (Object.keys(params).length > 0) {
      for (let param in params) {
        if (params.hasOwnProperty(param)) {
          let layer = map.findLayerById(param);
          //console.log("layer found", layer);
          if (layer) {
            layer.on("layerview-create", (event) => {
              // The LayerView for the layer that emitted this event
              //console.log(event)
              this.findSublayer(layer, params[param], map);
            });

          }
        }
      }
    }
  }

  findSublayer(layer: any, ids: string, map: any) {
    let idsArr = ids.split("!");
    //console.log(idsArr);
    idsArr.forEach(id => {
      //setTimeout(()=>{
      let sublayer = layer.findSublayerById(parseInt(id));
      //console.log(sublayer);
      sublayer ? sublayer.visible = true : "";
      //}, 600)

    })
  }

  getLisProjects(projects): void {
    this.projectsObs.next(projects);
  }

  isMobileDevice(mobile: boolean) {
    this.mobile = mobile;
  }

  //mobile check
  mobilecheck() {
    var check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  //createOperationalItems()

  initLayerListWidget() {
    let listWidget = new LayerList({
      container: "layer-list",
      view: this.view
    });

    setTimeout(() => {
      //console.log("listWidget", listWidget);
      //console.log("listWidget ITEMS", listWidget.operationalItems.items);
      listWidget.operationalItems.items.map(function(item) {
        item.open = true;
        item.children.items.map((child) => child.open = true);
      });
    }, 800);

    return listWidget;
  }

  initSubLayerListWidget(view, map) {
    let subLayer = map.findLayerById("allLayers");
    //onsole.log("SUB VIEW", view);
    //console.log("all layers VIEW", subLayer);
    //let mod = this.modifySubLayer(subLayer);
    //console.log("MODIFY", mod);
    return new LayerList({
      container: "sub-layers-content-list",
      view: view,
      //operationalItems: this.getOperationalItems(subLayer)
      operationalItems: [
        {
          layer: subLayer,
          //actionsOpen: true,
          //open: true,
          view: view
        }
      ]
    });
  }

  //modify subLayer and remove current theme layer
  modifySubLayer(subLayer) {
    let layerMod = subLayer;
    //console.log("LAYERIS", subLayer)
    let items = subLayer.sublayers.items.filter(layer => {
      if (layer.title !== "Transportas / Dviračiai") {
        return layer;
      }
    });
    layerMod.sublayers = items;
    return layerMod;

  }

  //not using this approach as identification extends to many separate promises
  getOperationalItems(layer) {
    //operational item type Array<any> or any[]
    let operationalItems: Array<any> = [];
    //console.log(layer.sublayers.items)
    layer.sublayers.items.forEach(layer => {
      //operational item's object
      let innerItem = {
        layer: layer,
        open: true,
        view: this.view
      };
      operationalItems.push(innerItem);
    });

    return operationalItems.reverse();
  }

  //init custom basemaps
  customBasemaps(layersArray: any[]) {
    return new Basemap({
      baseLayers: layersArray,
      title: "Pagrindo žemėlapiai",
      id: "customBasempa"
    });
  }

  //get URL theme name from ActivatedRoute
  getThemeName(name) {
    this.themeName = name;
  }

  returnThemeName() {
    return this.themeName;
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
        //console.log(resultAtr);
        if (!(resultAtr == "OBJECTID" || resultAtr == "layerName" || resultAtr == "SHAPE" || resultAtr == "SHAPE.area" || resultAtr == "Shape.area" || resultAtr == "SHAPE.STArea()" || resultAtr == "Shape" || resultAtr == "SHAPE.len" || resultAtr == "Shape.len" || resultAtr == "SHAPE.STLength()" || resultAtr == "SHAPE.fid" ||
          resultAtr == "Class value" || resultAtr == "Pixel Value" || resultAtr == "Count_" //TEMP check for raster properties
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
    //ids will have 2 properties: 'identificationsIds' (layers to be identified) and 'visibilityIds' (all visible layers that must be checked and visible depending on mxd settings or user activated layers)
    let ids: any = {};
    ids["identificationsIds"] = {};
    ids["visibilityIds"] = {};
    let viewScale = view.scale;
    //console.log("VIEW", view);
    //console.log("layerViews", view.layerViews)
    view.layerViews.items.map(item => {
      //TODO refactor mapDefaultService and mapService, for projects theme get VisibleLayers Ids only for alllayers service
      if (item.layer.id === "allLayers") {
      //small fix: add layer id that doen't exist, for example 999, in order to prevent all layers identification when all lists are turned off
      ids.identificationsIds[item.layer.id] = [999];
      ids.visibilityIds[item.layer.id] = [999];
      //console.log("IDS", item)

      //do not identify layer if it is Raster
      if ((item.visible) && (!item.layer.isRaster)) {
        //UPDATE: identify raster layers as well
        //if (item.visible) {
        let subLayers = item.layer.sublayers.items;
        //console.log("subLayer", subLayers);
        subLayers.map((subLayer) => {
          let minScale = subLayer.minScale;
          let maxScale = subLayer.maxScale;
          //add number to fit viewScale, because 0 in Esri logic means layer is not scaled
          ((minScale === 0)) ? minScale = 99999999 : minScale;

          // console.log(subLayer.minScale , viewScale , subLayer.maxScale)
          // console.log(minScale , viewScale , maxScale)
          //if layer is visible and in view scale
          if (subLayer.visible) {
            ids.visibilityIds[item.layer.id].push(subLayer.id);
            if ((maxScale < viewScale) && (viewScale < minScale)) {
              //check if sublayer has subsublayers
              if (subLayer.sublayers) {
                //console.log("subsubLayer", subLayers);
                //3 layer if exist
                let subsublayers = subLayer.sublayers.items;
                subsublayers.map(subsublayer => {
                  let subMinScale = subsublayer.minScale;
                  let subMaxScale = subsublayer.maxScale;
                  ((subMinScale === 0)) ? subMinScale = 99999999 : subMinScale;
                  //if layer is visible and in view scale
                  if (subsublayer.visible) {
                    ids.visibilityIds[item.layer.id].push(subsublayer.id);
                    if ((subMaxScale < viewScale) && (viewScale < subMinScale)) {
                      //console.log("Sub subsubLayer", subLayers);

                      if (subsublayer.sublayers) {
                        //4 layer if exist
                        let subsubsublayers = subsublayer.sublayers.items;
                        subsubsublayers.map(subsubsublayer => {
                          let subMinScale = subsubsublayer.minScale;
                          let subMaxScale = subsubsublayer.maxScale;
                          ((subMinScale === 0)) ? subMinScale = 99999999 : subMinScale;
                          //if layer is visible and in view scale
                          if (subsubsublayer.visible) {
                            ids.visibilityIds[item.layer.id].push(subsubsublayer.id);
                            if ((subsubsublayer.visible) && (subMaxScale < viewScale) && (viewScale < subMinScale)) {
                              //console.log("SubSUB subsubLayer", subsubsublayers);
                              ids.identificationsIds[item.layer.id].push(subsubsublayer.id);

                            }
                          }
                        });
                      } else {
                        //push id's if it has no sublayers
                        ids.identificationsIds[item.layer.id].push(subsublayer.id);
                      }
                    }
                  }
                });
              }
              //else push id
              else {
                ids.identificationsIds[item.layer.id].push(subLayer.id);
              }
            }
          }
        })
      }
    }
    })
    //console.log("FINAL IDS", ids)
    this.visibleLayers = ids;
    return ids;
  }

  getVisibleSubLayerNumber(view: any) {
    let ids: any = this.getVisibleLayersIds(view);
    //console.log("ids", ids.identificationsIds);
    ids.identificationsIds.allLayers ? this.visibleSubLayerNumber = ids.identificationsIds.allLayers.length - 1 : this.visibleSubLayerNumber = 0;
    //console.log("visibleSubLayerNumber", this.visibleSubLayerNumber);
    return this.visibleSubLayerNumber;
  }
}
