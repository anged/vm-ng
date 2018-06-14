import { NgModule } from '@angular/core';

import { MapProjectsComponent } from './map-projects.component';
import { ShareModule } from '../../share.module';
import { ProjectsRouting } from './projects.routing';

@NgModule({
  imports: [
    ShareModule,
    ProjectsRouting
  ],
  declarations: [
    MapProjectsComponent
  ]
})
export class ProjectsModule { }
