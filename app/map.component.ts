import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { MapService } from './map.service';
import { ProjectsListService } from './projects-list/projects-list.service';
import { SearchService } from './search/search.service';
import { MapOptions } from './options';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ScaleAndLogoComponent } from './map-widgets/scale-and-logo.component';
import { CreditsCompponent } from './map-widgets/credits.component';
import { ProjectsGalleryComponent } from './gallery/projects-gallery.component';

import watchUtils = require("esri/core/watchUtils");
import on = require("dojo/on");
import Bundle = require("dojo/i18n!esri/nls/common");

import { FeatureQueryService } from './query/feature-query.service';
import { IdentifyService } from './services/identify/identify.service';
import { PointAddRemoveService } from './query/point-add-remove.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'esri-map',
  templateUrl: './app/map.component.html'
})
export class MapComponent implements OnInit, OnDestroy {
  //get child component reference
  @ViewChild(ProjectsListComponent) projectsListComponent: ProjectsListComponent;

  private itvFeatureUrl: string = MapOptions.themes.itvTheme.layers.uniqueProjects + "/0";

  //execution of an Observable,
  subscription: Subscription;
  queryUrlSubscription: Subscription;

  queryParams: any;
  sqlString: string = "";

  projectsListArr: any[];
  projectsListArrToComponent: any[];
  //fullList: Array<any>;
  fullListChanged: Array<any>;
  autocompleteValue: string = "";
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

  constructor(private _mapService: MapService, private elementRef: ElementRef, private projectsService: ProjectsListService, private searchService: SearchService, private featureService: FeatureQueryService, private identify: IdentifyService, private pointAddRemoveService: PointAddRemoveService, private activatedRoute: ActivatedRoute) {
    this.queryUrlSubscription = activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        //console.log("URL Parametrai", queryParam);
        return this.queryParams = queryParam
      }
    );
  }

  getSqlString() {
    return this.sqlString;
  }

  // toggle help container
  helpOpen(e) {
    this.helpContainerActive = !this.helpContainerActive;
  }

  select(e) {
    e.target.select()
  }
  // toggle share container
  shareToggle(e) {
    //get share url
    let currentZoom: number, currentCoordinates: number[];
    currentZoom = this.view.zoom;
    currentCoordinates = [this.view.center.x, this.view.center.y];
    this.shareUrl = window.location.origin + window.location.pathname + '?zoom=' + currentZoom + '&x=' + currentCoordinates[0] + '&y=' + currentCoordinates[1];
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

  onFilter(items) {
    //first item  of items array (items[0]) is filteredList, second input value
    this.autocompleteValue = this.projectsService.filterAutoComplete(items[1]);
    //console.log(this.fullListChanged);
    //console.log(this.autocompleteValue);

    //getprojects when writing in autocomplet box as well
    this.getProjects(this.itvFeatureUrl, this.view.extent, this.sqlString);
  }

  getFullListChanged() {
    return this.fullListChanged;
  }

  getProjects(itvFeatureUrl, extent, sqlStr, count = -1) {
    //execute queryTask on projects with extent
    this.projectsService.runProjectsQueryExtent(itvFeatureUrl, extent, sqlStr).then(() => {
      this.projectsListArr = this.projectsService.getProjects();
      this.projectsListArrToComponent = this.projectsService.getProjects();
    });
    //execute queryTask on projects without extent
    let inputValue = this.autocompleteValue;
    this.projectsService.runProjectsQuery(itvFeatureUrl, sqlStr, inputValue).then(() => {
      this.fullListChanged = this.projectsService.getAllProjects();
    });
    //add to Subject
    if (count === 0) {
      this._mapService.getLisProjects(this.projectsListArr);
    }
  }

  getFilteredprojects(view, sqlStr) {
    let itvFeatureUrl = this.itvFeatureUrl;
    this.getProjects(itvFeatureUrl, view.extent, sqlStr);
  }

  initView(view) {
    let itvFeatureUrl = this.itvFeatureUrl;
    let identify = this.identify.identify(MapOptions.themes.itvTheme.layers.identifyLayer);
    let identifyParams = this.identify.identifyParams();
    let count = 0;

    //get projects when interacting with the view
    watchUtils.whenTrue(view, "stationary", (b) => {
      let sqlStr = this.getSqlString();
      // Get the new extent of the view only when view is stationary.
      if (view.extent) {
        //console.log(view.extent);
        this.getProjects(itvFeatureUrl, view.extent, sqlStr, count);
        count += 1;
      }
    });

    //console.log("VIEW", view.on)
    view.on("pointer-move", (event) => {
      //console.log("MOUSE event", event.native)
    });

    view.on("click", (event) => {
      //if mobile identify with query
      if (this.mobile) {
        this.pointAddRemoveService.identifyItem(this.map, view, this.featureLayers, event);
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
        //activate list from map element
        let currentFilterName: String = this.projectsListComponent.getListName();
        this.activateList(features.results["0"].graphic.attributes.UNIKALUS_NR, currentFilterName)

        //console.log("Rez", features.results)

        //find feature layer and asign popup template to feature
        this.map.findLayerById(features.results["0"].graphic.layer.id).popupTemplate = {
          title: this.projectsService.getPopUpTitle(features.results["0"].graphic.attributes),
          //whenever getPopUpContent executes in projectsService, Observable is beeing subscribed on projectsListComponent and added to popup
          content: this.projectsService.getPopUpContent(features.results["0"].graphic.attributes)
        }

        //start selection of graphics
        this.pointAddRemoveService.showOnlySlectionGraphic(features.results["0"].graphic.attributes.UNIKALUS_NR, this.map, this.view, this.featureLayers);
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
    let basemaps: any[] = [];
    this.mobile = this._mapService.mobilecheck();
    this._mapService.isMobileDevice(this.mobile);
    //console.dir(Bundle);
    //get full list on init
    this.projectsService.getAllProjectsQueryData(this.itvFeatureUrl);

    // create the map
    this.map = this._mapService.initMap(MapOptions.mapOptions);
    //create view
    this.view = this._mapService.viewMap(this.map);

    //add  basemap layer
    basemaps.push(this._mapService.initTiledLayer(MapOptions.mapOptions.staticServices.basemapDarkUrl, "base-dark"));
    basemaps.push(this._mapService.initTiledLayer(MapOptions.mapOptions.staticServices.ortofotoUrl, "base-orto", false));
    basemaps.push(this._mapService.initTiledLayer(MapOptions.mapOptions.staticServices.basemapUrl, "base-map", false));
    this.map.basemap = this._mapService.customBasemaps(basemaps);

    //add additional 2 layers as base
    this.map.add(this._mapService.initDynamicLayer(MapOptions.themes.itvTheme.layers.teritories, "itv-additional", "Teritorijų ribos", 0.2));

    //count feature layers, init and add feature layers to map
    this.addFeaturesToMap();

    this.view.then((view) => {
      //if query paremeteters defined zoom and center
      this._mapService.centerZoom(view, this.queryParams);
      //do not initVIew on every new subscribe event
      //subscribe expression str change, when user is filtering projects-theme
      this.subscription = this.featureService.expressionItem.subscribe(sqlStr => {
        //console.log("SUBSCRIPTION: ", sqlStr);
        this.sqlString = sqlStr;
        //get properties on filtering event passing a sql string
        this.getFilteredprojects(view, sqlStr);
      });

      //add default search widget
      this.search = this.searchService.defaultSearchWidget(view);
      view.ui.add(this.search, {
        position: "top-left",
        index: 2
      });
      this.search.on("search-start", (event) => {
        //console.log("SEARCH event", this.search);
        //console.log("SEARCH event", event);
        this.projectsListComponent.selectFilterByExtention();
        //setTimeout(()=>{this.view.zoom = 6},500);
      });
      //init view and get projects on vie stationary property changes
      this.initView(view);
    });

    this.activatedRoute.url.subscribe((url) => {
      url["0"] ? this._mapService.getThemeName(url["0"].path) : "";
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
