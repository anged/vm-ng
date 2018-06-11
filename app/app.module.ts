import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map.component';
import { MapDefaultComponent, MapBuildingsComponent, MapKindergartensComponent } from './themes';
import { ThemesComponent } from './themes.component';
import { AppComponent } from './app.component';
import { CommonWidgetsComponent } from './common-widgets.component';
import { SearchKindergartensComponent } from './map-widgets/search-kindergartens.component';
import { MenuModule } from './menu/menu.module';
import { MapService } from './map.service';
import { MapDefaultService } from './themes/default/map-default.service';
import { ProjectsListService } from './projects-list/projects-list.service';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsFilterService } from './projects-list/projects-filter.service';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { SearchService } from './search/search.service';
import { SelectorsService } from './selectors/selectors.service';
import { MapWidgetsService } from './map-widgets/map-widgets.service';
import { IdentifyService } from './services/identify/identify.service';
import { FeatureQueryService } from './query/feature-query.service';
import { PointAddRemoveService } from './query/point-add-remove.service';
import { TextHighlightPipe } from './pipes/text-highlight.pipe';
import { ScaleAndLogoComponent, BasemapToggle, CreditsCompponent, CompassComponent, SidebarComponent, SidebarKindergartensComponent, MaintenanceComponent } from './map-widgets';
//import { ProjectsGalleryComponent } from './gallery/projects-gallery.component';
//import { Ng2GalleryCompontent } from './gallery/ng2-gallery.component';
import { Routing } from './app.routing';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';

//import { Ng2ImageGalleryModule } from 'ng2-image-gallery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { NgxPopperModule } from 'ngx-popper';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    // HttpModule,
    // JsonpModule,
    HttpClientModule,
    Routing,
    BrowserAnimationsModule,
    //Appliaction custom modules
    MenuModule,
    //3rd party imports
    MatExpansionModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule,
    MatSelectModule, MatBadgeModule, MatIconModule,
    //Ng2ImageGalleryModule,
    NgxPopperModule
  ],
  declarations: [
    AppComponent,
    MapComponent,
    MapDefaultComponent,
    MapBuildingsComponent,
    MapKindergartensComponent,
    ThemesComponent,
    ProjectsListComponent,
    AutoCompleteComponent,
    TextHighlightPipe,
    ScaleAndLogoComponent,
    BasemapToggle,
    CreditsCompponent,
    CompassComponent,
    SidebarComponent,
    SidebarKindergartensComponent,
    //ProjectsGalleryComponent,
    //Ng2GalleryCompontent,
    CommonWidgetsComponent,
    SearchKindergartensComponent,
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
    PointAddRemoveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
