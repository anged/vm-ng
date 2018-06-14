import { NgModule } from '@angular/core';


import { MapKindergartensComponent } from './map-kindergartens.component';
import { ShareModule } from '../../share.module';
import { KindergartensRouting } from './kindergartens.routing';


@NgModule({
  imports: [
    ShareModule,
    KindergartensRouting
  ],
  declarations: [
    MapKindergartensComponent
  ]
})
export class KindergartensModule { }
