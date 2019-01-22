import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

import { MapService } from '../../map.service';
import { MenuService } from '../../menu/menu.service';
import { MetaService } from '../../services/meta.service';
import { QuartersTooltipService } from './quarters-tooltip.service';
import { QuartersLayersService } from './quarters-layers.service';
import { SearchService } from '../../search/search.service';
import { BasemapsService } from '../../map-widgets/basemaps.service';
import { ViewService } from '../default/view.service';
import { ShareButtonService } from '../../services/share-button.service';
import { IdentifyService } from '../../services/identify/identify.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'quarters-criteria',
  template: `
		<button mat-raised-button (click)="openBottomSheet()">Pasirinkite rodiklį</button>
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
		}
		`]
  //changeDetection: ChangeDetectionStrategy.OnPush

})
export class QuartersCriteriaComponent implements OnInit, OnDestroy {

  constructor(
		private bottomSheet: MatBottomSheet
	) {}

  ngOnInit() {
  }

	openBottomSheet(): void {
		this.bottomSheet.open(CriteriaSelectionComponent);
	}

  ngDoCheck() {
    //console.log('Do Check');
  }

  ngOnDestroy() {
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
	quartersLayers: any[];
	activeId: number;

  constructor(
		private bottomSheetRef: MatBottomSheetRef<CriteriaSelectionComponent>,
		private mapService: MapService,
		private quartersLayersService: QuartersLayersService
	) {}

	ngOnInit() {
		const map = this.mapService.returnMap();
		this.quartersLayers = this.quartersLayersService.quartersLayers;

		// set id using some() method
		this.quartersLayers.some((layer) => {
			if(layer.visible) {
				this.activeId = layer.id;
				return true;
			}
		})
		//this.quartersLayers = map.findLayerById('quarters').sublayers.items.sort((a, b) => a.id - b.id);
		console.log('quartersLayer', this.quartersLayersService.quartersLayers)

	}

  openLink(event: MouseEvent, id: number): void {
		this.activeId = id;
		this.quartersLayers.map((layer) => {
			layer.id === id ? layer.visible = true : layer.visible = false;
			return layer;
		})
    //this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
