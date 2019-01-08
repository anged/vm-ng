import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { ToolsNameService } from '../../tools-name.service';
import { MapService } from '../../../map.service';

@Component({
  selector: 'swipe-tool-container',
  template: `
		<div class="swipe-vertical-line"
		 (pan)="onPan($event)"
		 #swipeLine
		>
		</div>
	`,
  styles: [`
		// :host {
		// 	position: absolute;
		// 	height: 100%;
		// 	width: 100%;
		// 	top: 0;
		// 	bottom: 0;
		// }
		.swipe-vertical-line {
			border-left: 1px solid #e61c24;
	    border-right: 1px solid #c1272d;
	    background-color: #c1272d;
	    width: 6px;
	    height: 100vh;
	    padding: 0!important;
	    margin: 0;
	    z-index: 30;
	    cursor: col-resize;
	    //position: relative;
	    left: 50%;

			position: absolute;
		}

		img {
			position: absolute;
		}
	`]
})

export class SwipeToolContainerComponent implements OnInit, AfterViewInit {
	@ViewChild('swipeLine') swipeLine: ElementRef;
 	projectsMIL: any;
	img: string;

  constructor(
		private ms: MapService,
		private rend: Renderer2,
		private cdr: ChangeDetectorRef,
		private toolsNameService: ToolsNameService
	) {}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this.rend.appendChild(document.getElementsByClassName('esri-view-root')[0], this.swipeLine.nativeElement);

		//init Raster Image Layer
		const url = 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_rasters/MapServer';
		const view = this.ms.getView();
		this.projectsMIL = this.ms.initDynamicLayerITV(url, 'projects-mil', 'new layers', 1);

		view.then(view => {
			const url = this.projectsMIL.getImageUrl(view.extent.extent, view.width,  view.height).split('&');

			// ISSUE  with 4.5 API sublyers
			// we're just changing getImageUrl string params by removing - layers -  param.
			const slicedUrl = url.slice(0, url.length - 2).join('&') + '&f=image';
			this.img = this.rend.createElement('img');
			this.rend.setProperty(this.img, 'src', slicedUrl);
			this.rend.appendChild(document.getElementsByClassName('esri-view-surface')[0], this.img)
			console.log('url', url, slicedUrl, this.img)
		})
	}

	onPan(event) {
		console.log('Pan event', this.swipeLine.nativeElement.getBoundingClientRect(), event,event.center.x + 'px', );
		//this.rend.insertBefore(document.getElementsByClassName('esri-view-root')[0], this.swipeLine.nativeElement, document.getElementsByClassName('esri-view-surface')[0]);

		// move vertical swipeLine
		this.rend.setStyle(this.swipeLine.nativeElement, 'left',  event.center.x + 'px');
		//this.rend.setStyle(this.img, 'left',  event.center.x + 'px');
	}

}
