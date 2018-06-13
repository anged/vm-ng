import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapBuildingsComponent } from './themes';

const routes: Routes = [
  { path: '', component: MapBuildingsComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
