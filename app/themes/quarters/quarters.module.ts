import { NgModule } from '@angular/core';

import { MapQuartersComponent } from './map-quarters.component';
import { ShareModule } from '../../share.module';
import { QuartersRouting } from './quarters.routing';
import { QuartersTooltipService } from './quarters-tooltip.service';
import { QuartersLayersService } from './quarters-layers.service';

@NgModule({
  imports: [
    ShareModule,
    QuartersRouting
  ],
  declarations: [MapQuartersComponent],
	providers: [QuartersTooltipService, QuartersLayersService]
})
export class QuartersModule { }
