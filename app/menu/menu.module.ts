import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//import { MenuService }  from './menu.service';
import { ShareModule } from '../share.module';
import { MenuToolsService } from './menu-tools.service';
import { ThreeDExtractService } from "./tools/threed-extract/threed-extract.service";
import { MeasureMapService } from './tools/measure/measure-map.service'; // re-export the named thing
import { ToolsNameService } from './tools-name.service'; // re-export the named thing
import { MenuComponent } from './menu.component';
import {
  MenuLayersItvComponent,
  MenuSubLayersComponent,
  MenuLayersComponent,
  MenuLegendItvComponent,
  MenuLegendComponent,
  MenuToolsComponent,
  MenuThemesComponent,
  ThreeDExtractComponent,
  MeasureMapComponent,
  MeasureContainerComponent,
  ExtractContainerComponent,

  PrintMapComponent
} from '../menu';

import { NgDraggableModule } from 'angular-draggable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ShareModule,
    //3rd party declarations
    PerfectScrollbarModule,
    NgDraggableModule
  ],
  declarations: [
    MenuComponent,
    MenuThemesComponent,
    MenuToolsComponent,
    MenuSubLayersComponent,
    MenuLayersItvComponent, MenuLayersComponent,
    MenuLegendItvComponent, MenuLegendComponent,
    ThreeDExtractComponent, ExtractContainerComponent,
    MeasureMapComponent, MeasureContainerComponent,
    PrintMapComponent
  ],
  exports: [MenuComponent, MenuThemesComponent],
  providers: [
    MenuToolsService,
    ThreeDExtractService,
		MeasureMapService,
		ToolsNameService
  ]
})
export class MenuModule { }
