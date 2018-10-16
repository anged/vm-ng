import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { HideElementseDirective } from './directives/hideElement.directive';

//import { ViewService } from './themes/default/view.service';
//import { MapService } from './map.service';
import { MetaService } from './services/meta.service';
import { MapDefaultService } from './themes/default/map-default.service';
import { ProjectsListService } from './projects-list/projects-list.service';
import { ProjectsFilterService } from './projects-list/projects-filter.service';
import { SearchService } from './search/search.service';
import { SelectorsService } from './selectors/selectors.service';
import { MapWidgetsService } from './map-widgets/map-widgets.service';
//import { BasemapsService } from './map-widgets/basemaps.service';
import { IdentifyService } from './services/identify/identify.service';
import { FeatureQueryService } from './query/feature-query.service';
import { ShareButtonService } from './services/share-button.service';
import { PointAddRemoveService } from './query/point-add-remove.service';
//import { MapViewComponent } from './components/common/map-view.component';
import { ScaleAndLogoComponent, BasemapToggle, CreditsCompponent, CompassComponent, SidebarComponent, MaintenanceComponent } from './map-widgets';
//import { ProjectsGalleryComponent } from './gallery/projects-gallery.component';
//import { Ng2GalleryCompontent } from './gallery/ng2-gallery.component';


//import { Ng2ImageGalleryModule } from 'ng2-image-gallery';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { NgxPopperModule } from 'ngx-popper';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  imports: [
    CommonModule,
		FormsModule,
    PerfectScrollbarModule,
    //3rd party imports
    MatSelectModule,
    MatProgressBarModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatIconModule,
    //Ng2ImageGalleryModule,
    NgxPopperModule
  ],
  declarations: [
		HideElementseDirective,
    //MapViewComponent,
    ScaleAndLogoComponent,
    BasemapToggle,
    CreditsCompponent,
    CompassComponent,
    SidebarComponent,
    //ProjectsGalleryComponent,
    //Ng2GalleryCompontent,
    MaintenanceComponent
  ],
  exports: [
		HideElementseDirective,
    CommonModule,
    PerfectScrollbarModule,
    MatSelectModule,
    MatProgressBarModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatIconModule,
    NgxPopperModule,
    //MapViewComponent,
    ScaleAndLogoComponent,
    BasemapToggle,
    CreditsCompponent,
    CompassComponent,
    SidebarComponent,
    MaintenanceComponent,
  ],
  providers: [
    //ViewService,
    //MapService,
    MetaService,
    MapDefaultService,
    ProjectsListService,
    ProjectsFilterService,
    SearchService,
    SelectorsService,
    MapWidgetsService,
    //BasemapsService,
    FeatureQueryService,
    IdentifyService,
    ShareButtonService,
    PointAddRemoveService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ShareModule { }
