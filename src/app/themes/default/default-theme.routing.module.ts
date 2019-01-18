import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapDefaultComponent } from './map-default.component';

const defaultThemeRoutes: Routes = [
	{
		path: '',
		component: MapDefaultComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(defaultThemeRoutes)],
  exports: [RouterModule]
})
export class DefaultThemeRouting {};
