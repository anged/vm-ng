import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';

import { MapBuildingsComponent } from './themes';
import { ShareModule } from './share.module';

import { routing } from './lazy.routing';

@NgModule({
  imports: [ShareModule, routing],
  declarations: [MapBuildingsComponent]
})
export class LazyModule {}
