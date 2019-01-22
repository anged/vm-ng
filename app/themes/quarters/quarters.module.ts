import { NgModule } from '@angular/core';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { MapQuartersComponent } from './map-quarters.component';
import { QuartersCriteriaComponent, CriteriaSelectionComponent } from './quarters-criteria.component';
import { ShareModule } from '../../share.module';
import { QuartersRouting } from './quarters.routing';
import { QuartersTooltipService } from './quarters-tooltip.service';
import { QuartersLayersService } from './quarters-layers.service';

@NgModule({
  imports: [
		MatBottomSheetModule,
    ShareModule,
    QuartersRouting
  ],
  declarations: [MapQuartersComponent, QuartersCriteriaComponent, CriteriaSelectionComponent],
	entryComponents: [CriteriaSelectionComponent],
	providers: [QuartersTooltipService, QuartersLayersService]
})
export class QuartersModule { }
