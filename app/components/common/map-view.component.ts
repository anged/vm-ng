import { Component, OnInit, OnChanges, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2 } from '@angular/core';

import { MapService } from '../../map.service';
import { ViewService } from '../../themes/default/view.service';
import { BasemapsService } from '../../map-widgets/basemaps.service';
import { ShareButtonService } from '../../services/share-button.service';
import { MapOptions } from '../../options';

import watchUtils = require("esri/core/watchUtils");

// using onPuch change detection to avoid view ESRI UPDATES constanly initaiting change detection
@Component({
  selector: 'esri-map-view',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app/components/common/map-view.component.html',
  styles: [`
		.alert {
	    padding: 5px 10px;
	    margin-top: 10px;
			font-size: 14px;
	}
`]
})
export class MapViewComponent implements OnInit, OnChanges {
  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('bar') bar: ElementRef;

  queryParams = { basemap: null };
  maintenanceOn = false;
  shareContainerActive: boolean = false;

  //sharing url string
  shareUrl: string;

  view: any;

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2,
    private mapService: MapService,
    private viewService: ViewService,
    private basemapsService: BasemapsService,
    private shareButtonService: ShareButtonService) { }

  select(inputSelect) {
    console.log('inputSelect', inputSelect);
    inputSelect.select();
  }

  // toggle share container
  shareToggle() {
    this.shareContainerActive = !this.shareContainerActive;
    this.shareUrl = this.shareButtonService.shareToggle(this.shareContainerActive);
  }

  initBasemaps(map) {
    // initiate basemaps
    const basemaps = this.basemapsService.initBasemaps(map);

    // check for errors and add maintenance mode if neccessary
    basemaps.forEach((basemap) => {
      basemap
        .then(
          () => { },
          () => { this.maintenanceOn = true; }
        );
    });
  }

  ngOnInit() {
    // create the map
    const map = this.mapService.initMap(MapOptions.mapOptions);

    // create view
    this.view = this.mapService.viewMap(map);

    // initiate basemaps
    this.initBasemaps(map);

    //set map ref
    this.viewService.setmapElementRef(this.mainContainer);

    this.mapService.setProgressBar(this.bar);

    console.log('%c VIEW', 'color: brown;font-size: 23px', this.view)


    this.view.then((view) => {
      watchUtils.whenTrue(view, "updating", (b) => {
        console.log('%c VIEW', ' color: green;font-size: 23px', this.view)
        console.log("watchUtils", b)
        this.el.nativeElement.querySelector('#progress-load').style.display = "block";
        //this.renderer2.setStyle(this.bar, 'display', 'block');
        //this.bar._elementRef.nativeElement.style.display = "block";
        const intervalProgress = setInterval(() => {
          if (!this.view.updating) {
            console.log('%c intervalProgress', "font-size: 22px", intervalProgress);
            const clear = clearInterval(intervalProgress);
            this.el.nativeElement.querySelector('#progress-load').style.display = "none";
            //this.renderer2.setStyle(this.bar, 'display', 'none');
            //this.bar._elementRef.nativeElement.style.display = "none";
            console.log('%c intervalProgress end', "font-size: 22px", intervalProgress, clear);
          }
        }, 50)
      });


      this.view.on("layerview-create", (event) => {
        console.log(event.layer.loadStatus)
        //	const index = this.map.layers.items.length - 1;
        if (event.layer.id !== "allLayers") {
          setTimeout(() => {
            //this.renderer2.setStyle(this.bar.nativeElement, 'display', 'none');
            this.el.nativeElement.querySelector('#progress-load').style.display = "none";
            //this.bar._elementRef.nativeElement.style.display = "none";
          }, 600);
          console.log('%c PROGRESS', "color: red; font-size: 22px", this.el.nativeElement.querySelector('#progress-load'), event.layer.id, this.bar)
        }
      });
    });
  }

  ngOnChanges() {
    console.log('ONCHANGE')
  }

}
