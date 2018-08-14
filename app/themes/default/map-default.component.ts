import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";

import { MapService } from '../../map.service';
import { MetaService } from '../../services/meta.service';
import { MapDefaultService } from './map-default.service';
import { ProjectsListService } from '../../projects-list/projects-list.service';
import { SearchService } from '../../search/search.service';
import { BasemapsService } from '../../map-widgets/basemaps.service';
import { ViewService } from '../../themes/default/view.service';
import { ShareButtonService } from '../../services/share-button.service';
import { MapOptions } from '../../options';
import { ProjectsListComponent } from '../../projects-list/projects-list.component';
import { ScaleAndLogoComponent } from '../../map-widgets/scale-and-logo.component';
import { CreditsCompponent } from '../../map-widgets/credits.component';
import { CommonWidgetsComponent } from '../../common-widgets.component';
import { MaintenanceComponent } from '../../map-widgets/maintenance.component';

import on = require("dojo/on");
import all = require("dojo/promise/all");
import GraphicsLayer = require('esri/layers/GraphicsLayer');

import { FeatureQueryService } from '../../query/feature-query.service';
import { IdentifyService } from '../../services/identify/identify.service';
import { PointAddRemoveService } from '../../query/point-add-remove.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'esri-map-default',
  templateUrl: './app/themes/default/map-default.component.html'
})
export class MapDefaultComponent implements OnInit, OnDestroy {

  //execution of an Observable,
  queryUrlSubscription: Subscription;

	//dojo on map click event handler
	identifyEvent: any;

  queryParams: any;
  maintenanceOn = false;

  map: any;
  view: any;
  search: any;
  featureLayers: any[];

  helpContainerActive: boolean = false;
  shareContainerActive: boolean = false;

  //sharing url string
  shareUrl: string;

  //bug fix for API 4.4 version
  //add subDynamicLayers sublayers meta data
  subDynamicLayerSubLayers: any;

  constructor(
    private _mapService: MapService,
    private metaService: MetaService,
    private router: Router,
    private mapDefaultService: MapDefaultService,
    private elementRef: ElementRef,
    private projectsService: ProjectsListService,
    private searchService: SearchService,
    private featureService: FeatureQueryService,
    private identify: IdentifyService,
    private pointAddRemoveService: PointAddRemoveService,
    private activatedRoute: ActivatedRoute,
    private basemapsService: BasemapsService,
    private viewService: ViewService,
    private shareButtonService: ShareButtonService) { }

  select(e) {
    e.target.select();
  }

  // toggle share container
  shareToggle(e) {
    this.shareContainerActive = !this.shareContainerActive;
    this.shareUrl = this.shareButtonService.shareToggle(e, this.shareContainerActive);
  }

  initBasemaps(map, view, queryParams) {
    //initiate basemaps
    const basemaps = this.basemapsService.initBasemaps(map, view, queryParams);

    //check for errors and add maintenance mode if neccessary
    basemaps.forEach((basemap) => {
      basemap
        .then(
        () => { },
        err => {
          this.maintenanceOn = true;
        });
    });
  }

  ngOnInit() {
		//add basic meta data
		this.metaService.setMetaData();
    this.queryUrlSubscription = this.activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        this.queryParams = queryParam;
      }
    );
    this.queryUrlSubscription.unsubscribe();
    //console.log("init");
    //add snapshot url and pass path name ta Incetable map service
    //FIXME ActivatedRoute issues
    //const snapshotUrl = this.router.url.slice(1);
    const snapshotUrl = window.location.pathname.slice(1);

    // create the map
    this.map = this._mapService.initMap(MapOptions.mapOptions);
    //create view
    this.view = this._mapService.viewMap(this.map);

    //initiate basemaps
    this.initBasemaps(this.map, this.view, this.queryParams);

    //create theme layersStatus
    if (snapshotUrl) {
      this.viewService.createThemeLayers(snapshotUrl, this.queryParams);
    };

    this.view.then((view) => {
			//console.log('%c VIEW', 'color: red; font-size: 20px', view);
      this.viewService.createSubLayers(this.queryParams);
      //if query paremeteters are defined get zoom and center
      this._mapService.centerZoom(view, this.queryParams);

      //add default search widget
      this.search = this.searchService.defaultSearchWidget(view);
      view.ui.add(this.search, {
        position: "top-left",
        index: 2
      });

      //init identification of default or sub layers on MapView
      this.identifyEvent = this.identify.identifyLayers(view);
    }, err => { });
  }

  ngOnDestroy() {
    //console.log("Destroy map component");
		// dojo on remove event handler
		this.identifyEvent.remove();
		this.map.removeAll();
  }
}
