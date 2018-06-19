import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { CommonWidgetsComponent } from './common-widgets.component';
import { MenuModule } from './menu/menu.module';
import { MapService } from './map.service';
import { MapDefaultService } from './themes/default/map-default.service';
import { ProjectsListService } from './projects-list/projects-list.service';
import { ProjectsFilterService } from './projects-list/projects-filter.service';
import { SearchService } from './search/search.service';
import { SelectorsService } from './selectors/selectors.service';
import { MapWidgetsService } from './map-widgets/map-widgets.service';
import { IdentifyService } from './services/identify/identify.service';
import { FeatureQueryService } from './query/feature-query.service';
import { ShareButtonService } from './services/share-button.service';
import { PointAddRemoveService } from './query/point-add-remove.service';
import { ScaleAndLogoComponent, BasemapToggle, CreditsCompponent, CompassComponent, SidebarComponent, MaintenanceComponent } from './map-widgets';
//import { ProjectsGalleryComponent } from './gallery/projects-gallery.component';
//import { Ng2GalleryCompontent } from './gallery/ng2-gallery.component';
import {MatSelectModule} from '@angular/material/select';

//import { Ng2ImageGalleryModule } from 'ng2-image-gallery';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { NgxPopperModule } from 'ngx-popper';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    //3rd party imports
    MatSelectModule,
    //Ng2ImageGalleryModule,
    NgxPopperModule,
  ],
  declarations: [
    ScaleAndLogoComponent,
    BasemapToggle,
    CreditsCompponent,
    CompassComponent,
    SidebarComponent,
    //ProjectsGalleryComponent,
    //Ng2GalleryCompontent,
    CommonWidgetsComponent,
    MaintenanceComponent

  ],
  exports: [
    CommonModule,
    MenuModule,
    MatSelectModule,
    NgxPopperModule,
    ScaleAndLogoComponent,
    BasemapToggle,
    CreditsCompponent,
    CompassComponent,
    SidebarComponent,
    CommonWidgetsComponent,
    MaintenanceComponent
  ],
  providers: [
      MapService,
      MapDefaultService,
      ProjectsListService,
      ProjectsFilterService,
      SearchService,
      SelectorsService,
      MapWidgetsService,
      FeatureQueryService,
      IdentifyService,
      ShareButtonService,
      PointAddRemoveService
    ]
})
export class ShareModule { }
