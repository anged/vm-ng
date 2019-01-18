import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { MapService } from '../../map.service';
import { ViewService } from '../../themes/default/view.service';
import { MapStatusService } from '../../map-status.service';
import { BasemapsService } from '../../map-widgets/basemaps.service';
import { ShareButtonService } from '../../services/share-button.service';
import { MapOptions } from '../../options';

//import watchUtils = require("esri/core/watchUtils");
import { loadModules } from 'esri-loader';
import esri = __esri;

@Component({
  selector: 'esri-map-view',
  templateUrl: './map-view.component.html',
  styles: [`
		.alert {
	    padding: 6px 10px;
	    margin-top: 10px;
			font-size: 14px;
	}
	.share-btn {
		margin-top: 10px;
    padding: 6px 10px 6px 10px;
    background-color: #ffffff;
    border: 1px solid #53565d;
    border-radius: 2px;
    font-size: 14px;
    color: #4c4c4c;
    float: right;
	}
`]
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('bar') bar: ElementRef;

  queryParams = { basemap: null };
  maintenanceOn = false;
  shareContainerActive: boolean = false;

  //sharing url string
  shareUrl: string;

  view: any;

	isCopiedToClipboard = false;

	// MApview load status
	laodStatus = false

  constructor(
    private el: ElementRef,
    private mapService: MapService,
    private mapStatusService: MapStatusService,
    private viewService: ViewService,
    private basemapsService: BasemapsService,
    private shareButtonService: ShareButtonService) { }

  select(inputSelect) {
    inputSelect.select();
  }

  // toggle share container
  shareToggle() {
		this.isCopiedToClipboard = false;
    this.shareContainerActive = !this.shareContainerActive;
    this.shareUrl = this.shareButtonService.shareToggle(this.shareContainerActive);
  }

  async initBasemaps(map) {
    // initiate basemaps
    const basemaps = await this.basemapsService.initBasemaps(map);

    // check for errors and add maintenance mode if neccessary
    basemaps.forEach((basemap) => {
      basemap
        .then(
          () => { },
          () => { this.maintenanceOn = true; }
        );
    });
  }

	copy() {
		this.isCopiedToClipboard = false;
		this.isCopiedToClipboard = this.shareButtonService.copyToClipBoard();
	}

	ngOnInit() {}

  async ngAfterViewInit() {
		try {
		const [Map, MapView, watchUtils] = await loadModules([
			'esri/Map',
			'esri/views/MapView',
			'esri/core/watchUtils'
		]);
    // create the map
    const map = new Map();

    // create view
    this.view = new MapView({
      //container: this.elementRef.nativeElement.firstChild, // AG good practis
      container: 'map',
      constraints: {
        snapToZoom: true, //When true, the view snaps to the next LOD when zooming in or out. When false, the zoom is continuous.
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
    //this.mapService.watchLayers(this.view);

		console.log('map v', map, this.view);

    // initiate basemaps
    this.initBasemaps(map);

    //set map ref
    this.viewService.setmapElementRef(this.mainContainer);

    //this.mapService.setProgressBar(this.bar);

		const view = this.view;

		console.log('Await view ', this.view);


		this.view.then((view) => {
			console.log('VIEW LOADED ', this.view);
			// set state
			this.mapStatusService.setMapViewState(this.view);
			this.mapService.updateView(this.view);

		})

		watchUtils.whenTrue(view, "updating", () => {
			console.log('%c VIEW', ' color: green;font-size: 23px', this.view)
			this.el.nativeElement.querySelector('#progress-load').style.display = "block";
			const intervalProgress = setInterval(() => {
				if (view) {
					if (!view.updating) {
						clearInterval(intervalProgress);
						this.el.nativeElement.querySelector('#progress-load').style.display = "none";
					}

				}

			}, 50)

		});

		this.view.on("layerview-create", (event) => {
			console.log(event.layer.loadStatus)
			if (event.layer.id !== "allLayers") {
				setTimeout(() => {
					this.el.nativeElement.querySelector('#progress-load').style.display = "none";
				}, 600);
				//console.log('%c PROGRESS', "color: red; font-size: 22px", this.el.nativeElement.querySelector('#progress-load'), event.layer.id, this.bar)
			}

		});
	} catch(err) {
		console.warn('VP error: ' + err);
	}
	}

}
