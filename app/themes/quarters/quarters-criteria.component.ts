import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material';

import { MapService } from '../../map.service';
import { QuartersLayersService } from './quarters-layers.service';

import { timer, of } from 'rxjs';

import { switchMap, filter, take } from 'rxjs/operators';

@Component({
  selector: 'quarters-criteria',
  template: `
		<button #criteriaButton mat-raised-button (click)="openBottomSheet()">Pasirinkite rodiklį</button>
		{{t}}
	`,
	styles: [`
		:host {
			position: fixed;
	    bottom: 0;
	    text-align: center;
	    left: 0;
	    right: 0;
		}

		button {
			padding: 10px 20px;
			background: #e61c24;
			color: #fff;
			border-top-right-radius: 2px;
			border-top-left-radius: 2px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	    -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			display: none;
		}
	`]
})
export class QuartersCriteriaComponent implements AfterViewInit {
	@ViewChild('criteriaButton') criteriaButton: ElementRef;
	quartersLayers: any[];
	get t() {
		console.log("Changes Criteria")
		return '';
	}


  constructor(
		private bottomSheet: MatBottomSheet,
		private rend: Renderer2,
		private mapService: MapService,
		private quartersLayersService: QuartersLayersService
	) { }

  ngAfterViewInit() {
		console.log('ngAfterViewInit')
		timer(1000, 1000).pipe(
			switchMap((e) => {
				console.log(e)
				const map = this.mapService.returnMap();
				return of(map.findLayerById('quarters'))
			}),
			filter((feature) => {
				console.log(feature)
				return feature && feature.sublayers.items.length > 0;
			}),
			take(1)
		).subscribe((featureLayer) => {
			this.initFilters(featureLayer);
		});
  }

	initFilters(featureLayer) {
		this.quartersLayers = featureLayer.sublayers.items.sort((a, b) => a.id - b.id);
		this.rend.setStyle(this.criteriaButton.nativeElement, 'display', 'inline-block');

		// set defrault visibility based on mxd document (rest endpoint)
		// this.quartersLayers.map((layer) => {
		// 	layer.id === 0 ? layer.visible = true : layer.visible = false;
		// 	return (layer);
		// });

		// cache
		this.quartersLayersService.setQuartersLayer(this.quartersLayers);
	}

	openBottomSheet(): void {
		if (this.quartersLayers) {
			this.bottomSheet.open(CriteriaSelectionComponent);
		}

	}

}

@Component({
  selector: 'criteria-selection-componentent',
	styles: [`
		.button {
			margin: 5px;
			padding: 5px 17px;
			margin-right: 20px;
			background: #393c40;
			color: white;
			border-radius: 2px;
			font-size: 15px;
		}

		.active-filter {
			background: #e61c24;
		}

		.mat-bottom-sheet-container-large {

		}
	`],
  template: `
			<ng-container *ngFor="let layer of quartersLayers">
				<div class="button" [class.active-filter]="activeId === layer.id" (click)="openLink($event, layer.id)">
				{{ layer.title }}
				</div>
			</ng-container>
	`,
})
export class CriteriaSelectionComponent implements OnInit {
	quartersLayers: any;
	activeId: number;
	view: any;

  constructor(
		//private bottomSheetRef: MatBottomSheetRef<CriteriaSelectionComponent>,
		private mapService: MapService,
		private quartersLayersService: QuartersLayersService
	) {}

	ngOnInit() {
		this.view = this.mapService.getView();
		this.quartersLayers = this.quartersLayersService.quartersLayers;
		this.setActiveCriteria(this.quartersLayers);

	}

	setActiveCriteria(quartersLayers) {
		// set id using some() method
		if (this.quartersLayers) {
			quartersLayers.some((layer) => {
				if(layer.visible) {
					this.activeId = layer.id;
					return true;
				}

			});
		}

	}

  openLink(event: MouseEvent, id: number): void {
		if (this.quartersLayers) {
			this.activeId = id;
			this.quartersLayers.map((layer) => {
				layer.id === id ? layer.visible = true : layer.visible = false;
				return layer;
			})

		}

		this.view.popup.close();

    //this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
