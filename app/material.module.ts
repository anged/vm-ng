import { NgModule } from '@angular/core';

import {
  MatCheckboxModule,
  MatExpansionModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ]
})
export class MaterialModule {}
