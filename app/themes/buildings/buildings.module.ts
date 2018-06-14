import { NgModule } from '@angular/core';

import { MapBuildingsComponent } from '../../themes';
import { ShareModule } from '../../share.module';
import { BuildingsRouting } from './buildings.routing';

@NgModule({
  imports: [
    ShareModule,
    BuildingsRouting
  ],
  declarations: [MapBuildingsComponent]
})
export class BuildingsModule { }
