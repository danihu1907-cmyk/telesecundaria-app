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
import { LoginDashboard } from './features/login/login';
import { Citas } from './features/dashboard/pages/citas/citas';
import { Entregas } from './features/dashboard/pages/entregas/entregas';
import { Cotejos } from './features/dashboard/pages/cotejos/cotejos';
import { Inscripciones } from './features/dashboard/pages/inscripciones/inscripciones';
import { Usuarios } from './features/dashboard/pages/usuarios/usuarios';
import { Expedientes } from './features/dashboard/pages/expedientes/expedientes';

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
      { path: 'inicio', component: Inicio, data: { title: 'Inicio' } },
      { path: 'inscripciones', component: Inscripciones, data: { title: 'Inscripciones' } },
      { path: 'convocatorias', component: Convocatorias, data: { title: 'Convocatorias' } },
      { path: 'aspirantes', component: Aspirantes, data: { title: 'Aspirantes' } },
      { path: 'tutores', component: Tutores, data: { title: 'Tutores' } },
      { path: 'adjunciones', component: Adjunciones, data: { title: 'Adjunciones' } },
      { path: 'alumnos', component: Alumnos, data: { title: 'Alumnos' } },
      { path: 'grupos', component: Grupos, data: { title: 'Grupos' } },
      { path: 'actividades', component: Actividades, data: { title: 'Actividades' } },
      { path: 'revisiones', component: Revisiones, data: { title: 'Revisiones' } },
      { path: 'citas', component: Citas, data: { title: 'Citas' } },
      { path: 'entregas', component: Entregas, data: { title: 'Entregas' } },
      { path: 'cotejos', component: Cotejos, data: { title: 'Cotejos' } },
      { path: 'expedientes', component: Expedientes, data: { title: 'Expedientes' } },
      { path: 'usuarios', component: Usuarios, data: { title: 'Usuarios' } },
    ],
  },

  {
    path: 'LoginDashboard',
    component: LoginDashboard,
  },

  // Comodín por si escriben cualquier otra ruta (Redirige a la Landing)
  {
    path: '**',
    redirectTo: '',
  },
];
