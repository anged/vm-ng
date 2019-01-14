import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, NgZone } from '@angular/core';

import { MapOptions } from '../../../options';
import { ToolsNameService } from '../../tools-name.service';
import { MapService } from '../../../map.service';

import watchUtils = require("esri/core/watchUtils");

import { Observable, timer, pipe, of } from 'rxjs';
import { filter, mergeMapTo, mapTo, switchMap, first, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'swipe-container',
  template: `
		<div class="swipe-vertical-line"
		 (panmove)="onPanMove($event)"
		 #swipeLine
		>
			<span class="swipe-icon esri-icon-handle-vertical" aria-label="handle-vertical icon"></span>
		</div>

		<div class="swipe-msg" #swipeMsg>
			Priartinkite mastelį
		</div>
	`,
  styleUrls: ['app/menu/tools/swipe/swipe-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SwipeContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swipeLine') swipeLine: ElementRef;
  @ViewChild('swipeMsg') swipeMsg: ElementRef;
  projectsMIL: any;
  img: string;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  view;
  watchU;
  minScale = 2000;

  constructor(
    private ms: MapService,
    private rend: Renderer2,
    private cdr: ChangeDetectorRef,
    private toolsNameService: ToolsNameService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.rend.listen(this.swipeLine.nativeElement, 'dragstart', (e: Event) => {
        //console.log('drag started', e)
      })
      this.rend.appendChild(document.getElementsByClassName('esri-view-root')[0], this.swipeLine.nativeElement);

      // append swipe msg el
      this.rend.appendChild(document.getElementsByClassName('esri-view-surface')[0], this.swipeMsg.nativeElement);

      const url = 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_rasters/MapServer';
      const view = this.ms.getView();
      this.view = view;
			//console.log('VIEW', view)
      const map = this.ms.returnMap();
      // const oldMap = this.ms.returnMap();
      // const map = this.ms.initMap(MapOptions.mapOptions);
      // map.basemap = oldMap.basemap;
      // const newMapview = this.ms.viewMap(map, 'swipe-map')


      // create dynamic layer and add to map
      const projectsMIL = this.ms.initDynamicLayerITV(url, 'projects-mil', 'new layers', 1);
      // currently using 8 layers scale, LEVEL 5 = 5000
      // check basmepam's REST endpoiunt reference
      projectsMIL.minScale = this.minScale;

      // allways add to last index and ad id to canvas
      // though layer usually shoul be added at last index
      // (idetify canvas position with specified index)
      view.then(() => {
				//const index = map.allLayers.findIndex((layer) => layer.id === 'projects-mil');
        const index = map.allLayers.items.length;
        map.add(projectsMIL, index + 1);

        projectsMIL.on('layerview-create', (e) => {
					// get index of projectsMIL layers
					//const index = map.allLayers.findIndex((layer) => layer.id === 'projects-mil');
          //console.log('layer created', e, map,'\n', 'index', index, map.allLayers.items );


          // check if our specific canvas has been loaded with rxjs
          const source = timer(200, 400).pipe(
            switchMap(() => of(document.getElementsByClassName('esri-display-object').length - 1)),
            filter(obs => {
              //console.log(obs, index)
              //return obs === index
							// check if laoded by checking
							// if current loaded index is >  or  = to specified canvas index
              return index <= obs;
            }
            ),
            first()
          )
            .subscribe((lastIndex) => {
              //console.log('Last laoded index', lastIndex, map.allLayers.items.length - 1);
							// move layer to last index
							map.reorder(this.projectsMIL, map.allLayers.items.length);

              const canvas = document.getElementsByClassName('esri-display-object')[lastIndex - 1] as any;
              canvas.id = 'projects-mil';
              this.canvas = canvas;
              this.ctx = canvas.getContext('2d');

              const rect = this.swipeLine.nativeElement.getBoundingClientRect();
              // set initial clip
              this.setClip(rect.x);

              // init rectangle drawing
              this.drawRect();
            });

        });
      })

      this.watchU = watchUtils.whenTrue(view, "stationary", (e) => {

        if (view.extent) {
          //console.log(e);
          // init rectangle drawing
          this.drawRect()
        }
      });
    });
  }

  //onPan(event) {
  onPanMove(event) {
		//console.log('onPanMove', event);
    // move vertical swipeLine
		if (event.center.x > 0 && event.center.x < document.getElementById('map').clientWidth) {
			this.rend.setStyle(this.swipeLine.nativeElement, 'left', event.center.x + 'px');
		}

		// if moving left out of the view
		if (event.center.x <= 0 && event.direction === 2) {
			this.rend.setStyle(this.swipeLine.nativeElement, 'left', '0px');
		}

		// if moving right out of the view
		if (event.center.x > document.getElementById('map').clientWidth && event.direction === 4) {
			//console.log("RIGHT", document.getElementById('map').clientWidth  )
			this.rend.setStyle(this.swipeLine.nativeElement, 'left', document.getElementById('map').clientWidth - 4 + 'px');
		}

    const rect = this.swipeLine.nativeElement.getBoundingClientRect();
  //console.log('RECTANGLE', rect.x, event)
    // clip specific canvas elements
    this.setClip(event.center.x);
    this.drawRect();
  }

  drawRect() {
		// TODO check support
		const mapW = document.getElementById('map').clientWidth;
    const rect = this.swipeLine.nativeElement.getBoundingClientRect();
    if (this.view.scale > this.minScale && this.canvas) {
			//console.log('width', rect, this.canvas.width)
      this.rend.setStyle(this.swipeMsg.nativeElement, 'width', (mapW - rect.left) + 'px')
      this.rend.setStyle(this.swipeMsg.nativeElement, 'display', 'flex')
    } else {
      this.rend.setStyle(this.swipeMsg.nativeElement, 'width', '0px');
      this.rend.setStyle(this.swipeMsg.nativeElement, 'display', 'none');
    }
  }

  // clip specific canvas elements
  setClip(x) {
    //console.log(x)
    // clip specific canvas elements
    const rect = this.swipeLine.nativeElement.getBoundingClientRect();
    this.rend.setStyle(this.canvas, 'clip-path', `inset(${0}px ${0}px ${0}px ${x}px)`);
    this.rend.setStyle(document.getElementById('projects-mil'), 'clip', `rect(${0}px, ${this.canvas.width}px, ${rect.height}px, ${rect.left}px)`);
    //console.log('setClip', x, rect, document.getElementById('projects-mil'));
  }

	ngOnDestroy(): void {
		this.rend.removeChild(document.getElementsByClassName('esri-view-root')[0], this.swipeLine.nativeElement);
		this.rend.removeChild(document.getElementsByClassName('esri-view-root')[0], this.swipeMsg.nativeElement);
		this.rend.removeStyle(this.canvas, 'clip-path');
		this.rend.removeStyle(this.canvas, 'clip');
		this.watchU.remove();
	}

}
