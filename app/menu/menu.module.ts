import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { MenuComponent }  from './menu.component';
import { MenuLayersItvComponent, MenuLayersComponent, MenuLegendItvComponent, MenuLegendComponent, MenuToolsComponent, MenuThemesComponent } from '../menu';

import { Draggable } from 'ng2draggable';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [
    MenuComponent,
    MenuThemesComponent,
    MenuToolsComponent,
    MenuLayersItvComponent, MenuLayersComponent,
    MenuLegendItvComponent, MenuLegendComponent,
    //3rd party declarations
    Draggable
  ],
  exports: [MenuComponent],
  providers: []
})
export class MenuModule { }
