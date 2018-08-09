import { Injectable } from '@angular/core';
import { MapService } from '../map.service';
import { BasemapsService } from '../map-widgets/basemaps.service';

@Injectable()
export class ShareButtonService {
  //visible layers
  visibleLayers: any = {};
  visibleSubLayerNumber: number = 0;

  constructor(private mapService: MapService, private basemapsService: BasemapsService) { }

  shareToggle(e, shareContainerActive, isProjectsTheme=false) {
    //get visible and checked layers ids
    const view = this.mapService.getView();
    const ids: any = !isProjectsTheme ? this.getVisibleLayersIds(view) :  this.getVisibleLayersIds(view, true);
    const visibleLayersIds = ids.identificationsIds;
    const checkedLayersIds = ids.visibilityIds;
    //check if there is any visible layers that can be identied in allLayers group
    let identify: string;
    if (!isProjectsTheme) {
      identify = ids.identificationsIds.allLayers.length <= 1 ? '' : 'allLayers';
    } else {
      identify = '';
    }
    //console.log("ids", ids)
    //get share url
    let currentZoom: number, currentCoordinates: number[];
    currentZoom = view.zoom;
    currentCoordinates = [view.center.x, view.center.y];
    const shareUrlStr = window.location.origin + window.location.pathname + '?zoom=' + currentZoom + '&x=' + currentCoordinates[0] + '&y=' + currentCoordinates[1] + this.shareCheckedLayersIds(checkedLayersIds) + '&basemap='
      + this.basemapsService.returnActiveBasemap() + '&identify=' + identify;
    //highlight selected input
    if (shareContainerActive) {
      setTimeout(() => {
        const shareURL = document.getElementById("url-link") as HTMLInputElement;
        if (shareURL) {
          shareURL.select();
        }
      }, 20);
    }

    return shareUrlStr;
  }

  shareCheckedLayersIds(ids: any): string {
    let shareCheckStr: string = "";
    Object.keys(ids).forEach(function(key) {
      let widget = ids[key];
      shareCheckStr += "&" + key + "=";
      ids[key].forEach(id => shareCheckStr += id + "!");
    });
    return shareCheckStr;
  }

  getVisibleLayersIds(view, custom = false) {
    //ids will have 2 properties: 'identificationsIds' (layers to be identified) and 'visibilityIds' (all visible layers that must be checked and visible depending on mxd settings or user activated layers)
    this.visibleLayers["identificationsIds"] = {};
    this.visibleLayers["visibilityIds"] = {};
    let viewScale = view.scale;
    //console.log("VIEW", view);
    //console.log("layerViews", view.layerViews)
    view.layerViews.items.forEach(item => {
      if (!custom) {
        this.iterateVisibleLayersIds(item, viewScale);
      } else {
        if (item.layer.id === 'allLayers') {
          this.iterateVisibleLayersIds(item, viewScale);
        }
      }
    })
    return this.visibleLayers;
  }

  iterateVisibleLayersIds(item, viewScale) {
    //small fix: add layer id that doen't exist, for example 999, in order to prevent all layers identification when all lists are turned off
    this.visibleLayers.identificationsIds[item.layer.id] = [999];
    this.visibleLayers.visibilityIds[item.layer.id] = [999];
    //console.log("IDS", item)

    //do not identify layer if it is Raster
    if ((item.visible) && (!item.layer.isRaster) && (item.layer.sublayers)) {
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
          this.visibleLayers.visibilityIds[item.layer.id].push(subLayer.id);
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
                  this.visibleLayers.visibilityIds[item.layer.id].push(subsublayer.id);
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
                          this.visibleLayers.visibilityIds[item.layer.id].push(subsubsublayer.id);
                          if ((subsubsublayer.visible) && (subMaxScale < viewScale) && (viewScale < subMinScale)) {
                            //console.log("SubSUB subsubLayer", subsubsublayers);
                            this.visibleLayers.identificationsIds[item.layer.id].push(subsubsublayer.id);

                          }
                        }
                      });
                    } else {
                      //push id's if it has no sublayers
                      this.visibleLayers.identificationsIds[item.layer.id].push(subsublayer.id);
                    }
                  }
                }
              });
            }
            //else push id
            else {
              this.visibleLayers.identificationsIds[item.layer.id].push(subLayer.id);
            }
          }
        }
      })
    }
  }

  getVisibleSubLayerNumber(view: any, custom=false) {
    //argument custom dedicated for custom themes
    let ids: any = !custom ? this.getVisibleLayersIds(view) : this.getVisibleLayersIds(view, true);
    //console.log("ids", ids.identificationsIds);
    ids.identificationsIds.allLayers ? this.visibleSubLayerNumber = ids.identificationsIds.allLayers.length - 1 : this.visibleSubLayerNumber = 0;
    //console.log("visibleSubLayerNumber", this.visibleSubLayerNumber);
    return this.visibleSubLayerNumber;
  }

}
