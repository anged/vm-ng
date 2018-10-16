import { Routes, RouterModule } from '@angular/router'

import forIn from 'lodash-es/forIn';

import { ThemesComponent } from './themes.component';
import { NotFoundComponent } from './not-found.component';
import { MapViewComponent } from './components/common/map-view.component';
import { MapOptions } from './options';

let defaultThemesRoutes =  [];

function addDefaultRoutes() {
  forIn(MapOptions.themes, (layer, key) => {
    if (!layer.custom && layer.production ) {
			const id = layer.id;
      defaultThemesRoutes.push({ path: id, loadChildren: './themes/default/default-theme.module#DefaultThemeModule' })
    }
  });
};

addDefaultRoutes();

const MAP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: ThemesComponent },
  { path: '', component: MapViewComponent, children: [
		{ path: 'darzeliai', loadChildren: './themes/kindergartens/kindergartens.module#KindergartensModule' },
		{ path: 'projektai', loadChildren: './themes/projects/projects.module#ProjectsModule' },
		{ path: 'pastatai', loadChildren: './themes/buildings/buildings.module#BuildingsModule' },
		...defaultThemesRoutes,
	]},
  // { path: 'projektai', pathMatch: 'full', loadChildren: './themes/projects/projects.module#ProjectsModule' },
  // { path: 'darzeliai', loadChildren: './themes/kindergartens/kindergartens.module#KindergartensModule' },
  //{ path: 'pastatai', component: MapViewComponent, pathMatch: 'full', loadChildren: './themes/buildings/buildings.module#BuildingsModule' },
  // { path: 'pastatai', pathMatch: 'full', loadChildren: './themes/buildings/buildings.module#BuildingsModule' },
  //add page not found component (only in development)
  // using expressjs in production mode and redirecting to home page
  { path: '**', component: NotFoundComponent }
];

export const Routing = RouterModule.forRoot(MAP_ROUTES);
