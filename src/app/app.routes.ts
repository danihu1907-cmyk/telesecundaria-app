import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';

export const routes: Routes = [
  //  Página principal o Landing Page pública
  {
    path: '',
    component: LandingPage,
  },

  //  Redirección por defecto si entran a /auth a secas -> Ahora va al Welcome
  {
    path: 'auth',
    redirectTo: 'welcome', // CORREGIDO: Su entrada lógica ahora es la bienvenida
    pathMatch: 'full',
  },

  // PANTALLAS DE AUTENTICACIÓN INDEPENDIENTES (Cada una con su URL)
  {
    path: 'welcome', //AGREGADO: Nueva ruta para la pantalla de bienvenida
    loadComponent: () =>
      import('./features/auth/pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },

  // Comodín por si escriben cualquier otra ruta (Redirige a la Landing)
  {
    path: '**',
    redirectTo: '',
  },
];
