import { NgModule } from '@angular/core';

import { MapBuildingsComponent } from '../../themes';
import { ShareModule } from '../../share.module';
import { DefaultThemeRouting } from './default-theme.routing';

@NgModule({
  imports: [
    ShareModule,
    DefaultThemeRouting
  ],
  declarations: [MapBuildingsComponent]
})
export class DefaultThemeModule { }
