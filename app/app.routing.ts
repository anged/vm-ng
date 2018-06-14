import { Routes, RouterModule } from '@angular/router'

import forIn from 'lodash-es/forIn';

import { ThemesComponent } from './themes.component';
import { MapOptions } from './options';

let defaultThemesRoutes =  [];

function addDefaultRoutes() {
  forIn(MapOptions.themes, (layer, key) => {
    if (!layer.custom && layer.production ) {
      defaultThemesRoutes.push({ path: layer.id, loadChildren: './themes/default/default-theme.module#DefaultThemeModule' })
    }
  });
};

addDefaultRoutes();

const MAP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: ThemesComponent },
  { path: 'projektai', pathMatch: 'full',loadChildren: './themes/projects/projects.module#ProjectsModule' },
  { path: 'darzeliai', pathMatch: 'full', loadChildren: './themes/kindergartens/kindergartens.module#KindergartensModule' },
  { path: 'pastatai', pathMatch: 'full', loadChildren: './themes/buildings/buildings.module#BuildingsModule' },
  ...defaultThemesRoutes
  //add page not found component
  //{ path: '**', component: NotFoundComponent }
];

export const Routing = RouterModule.forRoot(MAP_ROUTES);
