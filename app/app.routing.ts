import { Routes, RouterModule } from '@angular/router'
import { ThemesComponent } from './themes.component';

const MAP_ROUTS: Routes = [
  { path: '', component: ThemesComponent },
  { path: 'projektai', loadChildren: './themes/projects/projects.module#ProjectsModule' },
  //{ path: 'pastatai', component: MapBuildingsComponent },
  { path: 'darzeliai', loadChildren: './themes/kindergartens/kindergartens.module#KindergartensModule' },
  { path: 'pastatai', loadChildren: './themes/buildings/buildings.module#BuildingsModule' },
  //add page not found component
  { path: '**', loadChildren: './themes/default/default-theme.module#DefaultThemeModule' }
  // ,
  // { path: '',  redirectTo: '/projektai', pathMatch: 'full' }
];

export const Routing = RouterModule.forRoot(MAP_ROUTS);
