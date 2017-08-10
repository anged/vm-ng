import { Component, OnInit, Input, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";

import { MapService } from '../../map.service';
import { MapDefaultService } from './map-default.service';
import { ProjectsListService } from '../../projects-list/projects-list.service';
import { SearchService } from '../../search/search.service';
import { MapWidgetsService } from '../../map-widgets/map-widgets.service';
import { MapOptions } from '../../options';
import { ProjectsListComponent } from '../../projects-list/projects-list.component';
import { ScaleAndLogoComponent } from '../../map-widgets/scale-and-logo.component';
import { CreditsCompponent } from '../../map-widgets/credits.component';
import { ProjectsGalleryComponent } from '../../gallery/projects-gallery.component';

import watchUtils = require("esri/core/watchUtils");
import on = require("dojo/on");
import Bundle = require("dojo/i18n!esri/nls/common");
import all = require("dojo/promise/all");

import { FeatureQueryService } from '../../query/feature-query.service';
import { IdentifyService } from '../../services/identify/identify.service';
import { PointAddRemoveService } from '../../query/point-add-remove.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'esri-map-default',
  templateUrl: './app/themes/default/map-default.component.html'
})
export class MapDefaultComponent implements OnInit {

  //execution of an Observable,
  subscription: Subscription;
  queryUrlSubscription: Subscription;

  queryParams: any;

  map: any;
  view: any;
  search: any;
  mobile: boolean;
  featureLayers: any[];

  mapListActive: number;
  wordListActive: number;

  helpContainerActive: boolean = false;
  shareContainerActive: boolean = false;

  //sharing url string
  shareUrl: string;

  constructor(private _mapService: MapService, private mapDefaultService: MapDefaultService, private elementRef: ElementRef, private projectsService: ProjectsListService, private searchService: SearchService, private featureService: FeatureQueryService, private identify: IdentifyService, private pointAddRemoveService: PointAddRemoveService, private activatedRoute: ActivatedRoute, private mapWidgetsService: MapWidgetsService) {
    this.queryUrlSubscription = activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        //console.log("URL Parametrai", queryParam);
        return this.queryParams = queryParam;
      }
    );
  }

  // toggle help container
  helpOpen(e) {
    this.helpContainerActive = !this.helpContainerActive;
  }

  select(e) {
    e.target.select();
  }
  // toggle share container
  shareToggle(e) {
    //get visible and checked layers ids
    let ids: any = this.mapDefaultService.getVisibleLayersIds(this.view);
    let visibleLayersIds: number[] = ids.identificationsIds;
    let checkedLayersIds: number[] = ids.visibilityIds;

    //get share url
    let currentZoom: number, currentCoordinates: number[];
    currentZoom = this.view.zoom;
    currentCoordinates = [this.view.center.x, this.view.center.y];
    this.shareUrl = window.location.origin + window.location.pathname + '?zoom=' + currentZoom + '&x=' + currentCoordinates[0] + '&y=' + currentCoordinates[1] + this.shareCheckedLayersIds(checkedLayersIds) + '&basemap='
    + this.mapWidgetsService.returnActiveBasemap();
    //console.log(this.shareUrl)
    //console.log(window.location)

    //toggle active state
    this.shareContainerActive = !this.shareContainerActive;

    //highlight selected input
    if (this.shareContainerActive) {
      setTimeout(() => {
        if (document.getElementById("url-link")) {
          document.getElementById("url-link").select();
        }
      }, 20);
    }
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

  initView(view) {
    let urls = this.mapDefaultService.getUrls();
    let identify = this.identify.identify(urls[0]);
    let identifyParams = this.identify.identifyParams();
    let count = 0;
    view.popup.dockOptions = {
      position: 'bottom-left'
    };

    //get projects when interacting with the view
    watchUtils.whenTrue(view, "stationary", (b) => {
      // Get the new extent of the view only when view is stationary.
      if (view.extent) {
        //this.getProjects(itvFeatureUrl, view.extent, sqlStr, count);
        count += 1;
      }
    });

    //console.log("VIEW", view.on)
    view.on("pointer-move", (event) => {
      //console.log("MOUSE event", event.native)
    });

    view.on("click", (event) => {
      //console.log("view", view);
      //store all deffered objects of identify task in def array
      let def: array = [];
      let ids: any = this.mapDefaultService.getVisibleLayersIds(view);
      let visibleLayersIds: number[] = ids.identificationsIds;
      view.popup.dockEnabled = false;
      view.popup.dockOptions = {
        // Disables the dock button from the popup
        buttonEnabled: true,
        // Ignore the default sizes that trigger responsive docking
        breakpoint: false,
        position: 'bottom-left'
      }
      identifyParams.geometry = event.mapPoint;
      identifyParams.mapExtent = view.extent;
      identifyParams.tolerance = 10;
      identifyParams.width = view.width;
      identifyParams.height = view.height;
      identifyParams.layerOption = 'visible';

      //foreach item execute task
      view.layerViews.items.forEach(item => {
        //asgin correct  visible ids based on layer name (layerId property)
        // layerId === item.layer.id
        identifyParams.layerIds = visibleLayersIds[item.layer.id];
        let defferedList = this.identify.identify(item.layer.url).execute(identifyParams).then((response) => {
          //console.log("RSP", response);
          let results = response.results;
          return results.map((result) => {
            let name = result.layerName;
            let feature = result.feature;
            feature.popupTemplate = {
              title: `${name}`,
              content: this.mapDefaultService.getVisibleLayersContent(result)
            };

            //add feature layer id
            feature["layerId"] = item.layer.id;
            return feature;
          });
        }).then(function(response) {
          //console.log('response', response)
          return response;
        }, (error) => { console.error(error); });

        def.push(defferedList);
      });

      //console.log("def", def);

      //using dojo/promise/all function that takes multiple promises and returns a new promise that is fulfilled when all promises have been resolved or one has been rejected.
      all(def).then(function(response) {
        let resultsMerge = [].concat.apply([], response.reverse()); //merger all results
        //console.log('response resultsMerge', resultsMerge)
        if (resultsMerge.length > 0) {
          view.popup.open({
            features: resultsMerge,
            location: event.mapPoint
          });
        }
      });

      //if mobile identify with query
      if (this.mobile) {
        //this.pointAddRemoveService.identifyItem(this.map, view, this.featureLayers, event);
      } else {
        //else identify with hitTest method
        //find layer and remove it, max 4 layers: polygon, polyline, point, and additional point if scale is set from point to point in mxd
        this._mapService.removeSelectionLayers(this.map);

        //TODO close any popup if opened,store current view in service
        //this.view.popup.close()
        //hitTest check graphics in the view
        this.hitTestFeaturePopup(view, event);

        //init popup on click event widh identify service
        //this.identify.showItvPopupOnCLick(view, event, identify, identifyParams);
      }

    }, (error) => { console.error(error); });
  }

  //activate word or map list item directly from map
  activateList(id: number, listName: String) {
    if (listName === "word") {
      this.wordListActive = id;
      //deactivate mapListActive
      this.mapListActive = null;
    } else {
      this.mapListActive = id;
      //deactivate wordListActive
      this.wordListActive = null;
    }
  }

  hitTestFeaturePopup(view: any, event: any) {
    // the hitTest() checks to see if any graphics in the view
    // intersect the given screen x, y coordinates
    var screenPoint = {
      x: event.x,
      y: event.y
    };
    //console.log(screenPoint)
    view.hitTest(screenPoint)
      .then(features => {

      });
  }

  addFeaturesToMap() {
    //count feature layers and add to map
    this._mapService.countRestlayers(MapOptions.themes.itvTheme.layers.mapLayer + "?f=pjson").subscribe(json => {
      let layersCount = json.layers.length;
      //creat layers arr
      let featureLayerArr = this._mapService.createFeatureLayers(layersCount, MapOptions.themes.itvTheme.layers.mapLayer);
      this.featureLayers = featureLayerArr;
      //add layers
      this.map.addMany(featureLayerArr);

      this.view.whenLayerView(featureLayerArr[0]).then(layerView => {
        //console.log("layerView:", layerView);
      });

    });
  }

  ngOnInit() {
    //console.log("LOADING");
    //url path from Observable / using snapshot instead // TODO change to Observable
    //this.activatedRoute.url.subscribe((url) => {
    //url["0"] ? this._mapService.getThemeName(url["0"].path)  : "";
    //});

    //add snapshot url and pass path name ta Incetable map service
    let snapshotUrl = this.activatedRoute.snapshot.url["0"]
    let basemaps: any[] = [];
    let themeGroupLayer: any;

    this.mobile = this._mapService.mobilecheck();
    this._mapService.isMobileDevice(this.mobile);
    //console.dir(Bundle);

    // create the map
    this.map = this._mapService.initMap(MapOptions.mapOptions);
    //create view
    this.view = this._mapService.viewMap(this.map);

    //create theme main layers grouped
    themeGroupLayer = this._mapService.initGroupLayer("theme-group", "Main theme layers", "show");

    //add  basemap layer
    //TODO refactor
    this.mapWidgetsService.returnBasemaps().forEach(basemap => {
        if (this.queryParams.basemap === basemap.id) {
          this.mapWidgetsService.setActiveBasemap(basemap.id);
          basemaps.push(this._mapService.initTiledLayer(MapOptions.mapOptions.staticServices[basemap.serviceName], basemap.id))
        } else {
          basemaps.push(this._mapService.initTiledLayer(MapOptions.mapOptions.staticServices[basemap.serviceName], basemap.id, false));
        }
    });

    this.map.basemap = this._mapService.customBasemaps(basemaps);

    this._mapService.updateMap(this.map);

    //add dyn layers
    if (snapshotUrl) {
      // themeGroupLayer.addMany(this.mapDefaultService.getDefaultDynamicLayers(snapshotUrl.path));
      // this.map.add(themeGroupLayer);
      this.map.addMany(this.mapDefaultService.getDefaultDynamicLayers(snapshotUrl.path));
      //console.log("MAP", this.map);
    };

    //add allLayers sublist layers
    let subDynamicLayers = this._mapService.initDynamicLayer("http://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Bendras/MapServer", "allLayers", "Visų temų sluoksniai", 0.8);
    this.map.add(subDynamicLayers);

    this.view.then((view) => {
      //if query paremeteters are defined get zoom and center
      this._mapService.centerZoom(view, this.queryParams);
      //add default search widget
      this.search = this.searchService.defaultSearchWidget(view);
      view.ui.add(this.search, {
        position: "top-left",
        index: 2
      });
      this.search.on("search-start", (event) => {
      });
      //check other url params if exists
      this._mapService.activateLayersVisibility(view, this.queryParams, this.map);

      //init view and get projects on vie stationary property changes
      this.initView(view);
    });
  }
}
