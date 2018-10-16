import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonWidgetsComponent } from './common-widgets.component';
import { ShareModule } from './share.module';
import { MenuModule } from './menu/menu.module';

import { Routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemesComponent } from './themes.component';
import { MapViewComponent } from './components/common/map-view.component';
import { NotFoundComponent } from './not-found.component';
import { ViewService } from './themes/default/view.service';
import { MenuService } from './menu/menu.service';
import { MapService } from './map.service';
import { BasemapsService } from './map-widgets/basemaps.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    ShareModule,
		MenuModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
		CommonWidgetsComponent,
    ThemesComponent,
    MapViewComponent,
    NotFoundComponent
  ],
  providers: [
    ViewService,
    MenuService,
    MapService,
    BasemapsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
