import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CampanasComponent } from './components/campanas/campanas.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'campanas', component: CampanasComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: '**', redirectTo: '' }
];