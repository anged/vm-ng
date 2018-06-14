import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapProjectsComponent } from '../../themes';

const projectsRoutes: Routes = [
  { path: '', component: MapProjectsComponent }
];

export const ProjectsRouting: ModuleWithProviders = RouterModule.forChild(projectsRoutes);
