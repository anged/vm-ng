import { Component, Inject, InjectionToken, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2, NgZone, ChangeDetectorRef } from '@angular/core';

import { MapService } from '../../../map.service';

import { timer, of } from 'rxjs';
import { filter, switchMap, first } from 'rxjs/operators';
import Swipe = require('esri/widgets/Swipe');

export const SWIPE_LAYER_URL = new InjectionToken<string>('swipeLayerUrl');

@Component({
  selector: 'swipe-container',
  template: `
		<div class="swipe-msg" #swipeMsg>
			Priartinkite mastelį
		</div>
	`,
  styleUrls: ['app/menu/tools/swipe/swipe-container.component.css'],
  providers: [
    { provide: SWIPE_LAYER_URL, useValue: 'https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_rasters_cached/MapServer' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SwipeContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('swipeMsg') swipeMsg: ElementRef;
  img: string;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  view;
  private swiper: Swipe;
  minScale = 2000;
  remove =false;

  constructor(
    @Inject(SWIPE_LAYER_URL) public swipeLayerUrl: string,
    private ngZone: NgZone,
    private ms: MapService,
    private rend: Renderer2,
  ) { }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initDomManipulation();
    });
  }

  initDomManipulation(): void {
    // // append swipe msg el
    const esriSurface = document.getElementsByClassName('esri-view-surface')[0];
    this.rend.appendChild(esriSurface, this.swipeMsg.nativeElement);

    const url = this.swipeLayerUrl;
    const view = this.ms.getView();
    const map = this.ms.returnMap();

    // create dynamic layer and add to map
    const projectsMIL = this.ms.initTiledLayer(url, 'projects-mil');
    projectsMIL.opacity = 1;

    this.view = view;

    // currently using 8 layers scale, LEVEL 5 = 5000
    // check basemap's REST endpoint reference
    projectsMIL.minScale = this.minScale;

    // allways add to last index and ad id to canvas
    // though layer usually shoul be added at last index
    // (idetify canvas position with specified index)
    view.when(() => {
      const index = map.allLayers.items.length;
      map.add(projectsMIL, index + 1);

      projectsMIL.on('layerview-create', (e) => {
        let trailingLayers = [projectsMIL];
        const swipe = new Swipe({
          view: view,
          trailingLayers,
          // container: 'swipe',
          position: 50 // position set to middle of the view (50%)
        });
        view.ui.add(swipe);
        this.swiper = swipe;

        // check if our specific canvas has been loaded with rxjs
        (timer(200, 400) as any).pipe(
          switchMap(() => of(document.getElementsByClassName('esri-swipe__container'))),
          filter((element: HTMLCollection) => element.length > 0),
          first()
        )
          .subscribe((el) => {
            const requestAnimation = window.requestAnimationFrame.bind(SwipeContainerComponent);
            const self = this;
            const rend = this.rend;
            const msgEl = this.swipeMsg.nativeElement;
            const scale = this.minScale;
            const sContainer = el[0];
            let stop = false;

            this.rend.listen(sContainer, 'pointermove', (position) => {
              if (position.pressure > 0 && stop) {
                stop = true;
                drawRect();
              }

            });

            // ADHOC draw message container using request animation frame
            // stop on component destroy
            function drawRect() {
              if (self.remove) {
                return;
              }
              // console.log('animate')
              if (view.scale > scale) {
                rend.setStyle(msgEl, 'width', 100 - swipe.position + '%')
                rend.setStyle(msgEl, 'display', 'flex')
              } else {
                rend.setStyle(msgEl, 'width', '0px');
                rend.setStyle(msgEl, 'display', 'none');
              }
              requestAnimation(drawRect);
            }

            drawRect();

          });

      });
    });

  }

  ngOnDestroy(): void {
    this.remove = true;
    this.rend.removeChild(document.getElementsByClassName('esri-view-root')[0], this.swipeMsg.nativeElement);
    this.swiper.destroy();
  }

}
