import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';
import { Inicio } from './features/dashboard/pages/inicio/inicio';
import { Convocatorias } from './features/dashboard/pages/convocatorias/convocatorias';
import { Aspirantes } from './features/dashboard/pages/aspirantes/aspirantes';
import { Tutores } from './features/dashboard/pages/tutores/tutores';
import { Adjunciones } from './features/dashboard/pages/adjunciones/adjunciones';
import { Alumnos } from './features/dashboard/pages/alumnos/alumnos';
import { Grupos } from './features/dashboard/pages/grupos/grupos';
import { Actividades } from './features/dashboard/pages/actividades/actividades';
import { AdminDashboard } from './features/dashboard/pages/admin-dashboard/admin-dashboard';
import { Revisiones } from './features/dashboard/pages/revisiones/revisiones';

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

  // Panel de administración (layout con rutas hijas)
  {
    path: 'dashboard',
    component: AdminDashboard,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio },
      { path: 'convocatorias', component: Convocatorias },
      { path: 'aspirantes', component: Aspirantes },
      { path: 'tutores', component: Tutores },
      { path: 'adjunciones', component: Adjunciones },
      { path: 'alumnos', component: Alumnos },
      { path: 'grupos', component: Grupos },
      { path: 'actividades', component: Actividades },
      { path: 'revisiones', component: Revisiones },
    ],
  },

  // Comodín por si escriben cualquier otra ruta (Redirige a la Landing)
  {
    path: '**',
    redirectTo: '',
  },
];
