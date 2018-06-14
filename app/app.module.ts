import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ShareModule } from './share.module';
import { Routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemesComponent } from './themes.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    ShareModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    ThemesComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
