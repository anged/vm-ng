import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material';

import { MapService } from '../../map.service';
import { QuartersLayersService } from './quarters-layers.service';
import { QuarterLayersMeta } from './QuarterLayersMeta';

import { timer, of, Subject, Observable } from 'rxjs';

import { switchMap, filter, takeUntil, take,tap, map } from 'rxjs/operators';

@Component({
  selector: 'quarters-criteria',
  template: `
		<button #criteriaButton mat-raised-button (click)="openBottomSheet()">Pasirinkite kriterijų</button>
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
export class QuartersCriteriaComponent implements AfterViewInit, OnDestroy {
	@ViewChild('criteriaButton') criteriaButton: ElementRef;
	quartersLayers: any[];
	destroyCompoent$ = new Subject();
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
			take(1),
			// to avoid memory leaks
			// when the subscription hasn’t received a value
			// before the component got destroyed.
			takeUntil(this.destroyCompoent$)
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

	ngOnDestroy() {
		this.destroyCompoent$.next();
		this.destroyCompoent$.complete();
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
			white-space: pre-wrap;
			white-space: -moz-pre-wrap;
			white-space: -pre-wrap;
			white-space: -o-pre-wrap;
			word-wrap: break-word;
		}

		.active-filter {
			background: #e61c24;
		}
		.active-filter:before {
			content: ' ';
	    position: absolute;
	    width: 0px;
	    height: 0px;
	    border-left: 10px solid transparent;
	    border-right: 10px solid transparent;
	    border-bottom: 10px solid #e61c24;
	    top: -8px;
	    left: 0;
	    right: 0;
	    margin: 0 auto;
		}
	`],
  template: `
			<criteria-description-tag [singleLayersMeta]="singleLayersMeta$ | async"></criteria-description-tag>
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
	singleLayersMeta$: Observable<any>;

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
					window.location.hash = 'legend';
					this.passObservable();
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

			this.passObservable();
		}

		this.view.popup.close();
		window.location.hash = 'legend';

    //this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

	passObservable() {
		this.singleLayersMeta$ = this.quartersLayersService.quarterLayersMeta.pipe(
			map((meta) => meta.filter((meta: any) => meta.id === this.activeId)[0]),
			filter(description  => description),
			tap(meta => console.log('tap meta', meta)),
		)
	}

}
