import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
