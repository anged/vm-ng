import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MapKindergartensComponent } from '../../themes';
import { SidebarKindergartensComponent } from '../../map-widgets';
import { SearchKindergartensComponent } from '../../map-widgets/search-kindergartens.component';
import { ShareModule } from '../../share.module';
import { KindergartensRouting } from './kindergartens.routing';


@NgModule({
  imports: [
    ShareModule,
    MatExpansionModule,
    MatCheckboxModule,
    KindergartensRouting
  ],
  declarations: [
    MapKindergartensComponent,
    SidebarKindergartensComponent,
    SearchKindergartensComponent
  ]
})
export class KindergartensModule { }
