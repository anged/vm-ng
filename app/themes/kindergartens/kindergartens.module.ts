import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

import { MapKindergartensComponent } from './map-kindergartens.component';
import { ShareModule } from '../../share.module';
import { KindergartensRouting } from './kindergartens.routing';
import { SidebarKindergartensComponent } from '../../map-widgets';
import { SearchKindergartensComponent } from '../../map-widgets/search-kindergartens.component';

@NgModule({
  imports: [
    ShareModule,
    MatCheckboxModule,
    MatExpansionModule,
    KindergartensRouting
  ],
  declarations: [
    MapKindergartensComponent,
    SidebarKindergartensComponent,
    SearchKindergartensComponent
  ]
})
export class KindergartensModule { }
