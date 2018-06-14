import { NgModule } from '@angular/core';

import { MapDefaultComponent } from './map-default.component';
import { ShareModule } from '../../share.module';
import { DefaultThemeRouting } from './default-theme.routing';

@NgModule({
  imports: [
    ShareModule,
    DefaultThemeRouting
  ],
  declarations: [MapDefaultComponent]
})
export class DefaultThemeModule { }
