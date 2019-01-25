import { Component, OnInit,  AfterViewInit, OnDestroy, OnChanges, Renderer2, Input, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material';

import { MapService } from '../../map.service';
import { QuartersLayersService } from './quarters-layers.service';
import { QuarterLayersMeta } from './QuarterLayersMeta';

import { timer, of, Subject } from 'rxjs';

import { switchMap, filter, takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'criteria-description-tag',
  template: `
		<div class="description-tag">{{ singleLayersMeta?.description }}</div>
	`,
	styles: [`
		:host {

		}

		.description-tag {
			background: #d6d6d6;
	    color: #1e1d1d;
	    padding: 6px;
	    font-size: 18px;
	    margin-bottom: 10px;
		}
	`]
})
export class CriteriaDescriptionTagComponent implements AfterViewInit, OnDestroy, OnChanges {
	@Input() singleLayersMeta: QuarterLayersMeta;

  constructor(
		private bottomSheet: MatBottomSheet,
		private rend: Renderer2,
		private mapService: MapService,
		private quartersLayersService: QuartersLayersService
	) { }

	ngOnInit() {

	}

  ngOnChanges() {
		console.log('changes')
  }

  ngAfterViewInit() {
  }

	ngOnDestroy() {
	}

}
