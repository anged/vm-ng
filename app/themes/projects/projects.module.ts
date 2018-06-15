import { NgModule } from '@angular/core';

import { MapProjectsComponent } from './map-projects.component';
import { ShareModule } from '../../share.module';
import { ProjectsRouting } from './projects.routing';
import { ProjectsListComponent } from '../../projects-list/projects-list.component';
import { AutoCompleteComponent } from '../../autocomplete/autocomplete.component';
import { TextHighlightPipe } from '../../pipes/text-highlight.pipe';

@NgModule({
  imports: [
    ShareModule,
    ProjectsRouting
  ],
  declarations: [
    MapProjectsComponent,
    ProjectsListComponent,
    AutoCompleteComponent,
    TextHighlightPipe
  ]
})
export class ProjectsModule { }
