import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';
import { GaleriaCompletaPage } from './features/landing/pages/galeria-completa-page/galeria-completa-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'galeria',
    component: GaleriaCompletaPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
