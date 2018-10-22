import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//import { MenuService }  from './menu.service';
import { ShareModule } from '../share.module';
import { MenuToolsService } from './menu-tools.service';
import { ThreeDExtractService } from "./tools/threed-extract/threed-extract.service";
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
  ExtractContainerComponent
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
    ThreeDExtractComponent,
    ExtractContainerComponent
  ],
  exports: [MenuComponent, MenuThemesComponent],
  providers: [
    MenuToolsService,
    ThreeDExtractService
  ]
})
export class MenuModule { }
