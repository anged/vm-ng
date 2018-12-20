import { NgModule } from '@angular/core';

import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
		MatSelectModule,
    MatProgressBarModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatIconModule,
  ],
  exports: [
		MatSelectModule,
    MatProgressBarModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatIconModule,
  ],
	providers: [{provide: MATERIAL_SANITY_CHECKS, useValue: false}]
})
export class MaterialModule {}
