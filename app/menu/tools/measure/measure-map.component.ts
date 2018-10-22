import { Component, OnInit } from '@angular/core';

import { MapService } from '../../../map.service';
import { MenuToolsService } from '../../menu-tools.service';

@Component({
  selector: 'measure-map',
  templateUrl: './app/menu/tools/print/print-map.component.html',
  styles: [`
		:host button {
	    margin: 10px;
	    padding: 6px 10px 6px 10px;
	    background-color: #e9e9e9;
	    border: 1px solid #53565d;
	    border-radius: 2px;
			font-size: 14px;
		}
	`]
})

export class MeasureMapComponent implements OnInit {
  private printActive = false;

  constructor(
    private mapService: MapService,
    private menuToolsService: MenuToolsService
  ) { }


  ngOnInit() {
    const view = this.mapService.getView();

  }

}
