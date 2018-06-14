import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 import { MapKindergartensComponent } from '../../themes';

const kindergartensRoutes: Routes = [
  { path: '', component: MapKindergartensComponent }
];

export const KindergartensRouting: ModuleWithProviders = RouterModule.forChild(kindergartensRoutes);
