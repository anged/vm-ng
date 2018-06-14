import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapBuildingsComponent } from '../../themes';

const buildingsRoutes: Routes = [
  { path: '', component: MapBuildingsComponent }
];

export const BuildingsRouting: ModuleWithProviders = RouterModule.forChild(buildingsRoutes);
