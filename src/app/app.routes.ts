import { Routes } from '@angular/router';
import { authTutorGuard } from './core/guards/auth-tutor.guard';

export const routes: Routes = [
  // PAGINA PRINCIPAL O LANDING PAGE PUBLICA
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/pages/landing-page/landing-page').then((m) => m.LandingPage),
  },

  // REDIRECCION POR DEFECTO SI ENTRAN A /auth A SECAS -> AHORA VA AL WELCOME
  {
    path: 'auth',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },

  // PANTALLAS DE AUTENTICACION INDEPENDIENTES (TODAS SON PUBLICAS Y EXISTEN)
  {
    path: 'welcome',
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
    loadComponent: () =>
      import('./features/dashboard/pages/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard,
      ),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/dashboard/pages/inicio/inicio').then((m) => m.Inicio),
        data: { title: 'Inicio' },
      },
      {
        path: 'inscripciones',
        loadComponent: () =>
          import('./features/dashboard/pages/inscripciones/inscripciones').then(
            (m) => m.Inscripciones,
          ),
        data: { title: 'Inscripciones' },
      },
      {
        path: 'convocatorias',
        loadComponent: () =>
          import('./features/dashboard/pages/convocatorias/convocatorias').then(
            (m) => m.Convocatorias,
          ),
        data: { title: 'Convocatorias' },
      },
      {
        path: 'aspirantes',
        loadComponent: () =>
          import('./features/dashboard/pages/aspirantes/aspirantes').then((m) => m.Aspirantes),
        data: { title: 'Aspirantes' },
      },
      {
        path: 'tutores',
        loadComponent: () =>
          import('./features/dashboard/pages/tutores/tutores').then((m) => m.Tutores),
        data: { title: 'Tutores' },
      },
      {
        path: 'adjunciones',
        loadComponent: () =>
          import('./features/dashboard/pages/adjunciones/adjunciones').then((m) => m.Adjunciones),
        data: { title: 'Adjunciones' },
      },
      {
        path: 'alumnos',
        loadComponent: () =>
          import('./features/dashboard/pages/alumnos/alumnos').then((m) => m.Alumnos),
        data: { title: 'Alumnos' },
      },
      {
        path: 'grupos',
        loadComponent: () =>
          import('./features/dashboard/pages/grupos/grupos').then((m) => m.Grupos),
        data: { title: 'Grupos' },
      },
      {
        path: 'actividades',
        loadComponent: () =>
          import('./features/dashboard/pages/actividades/actividades').then((m) => m.Actividades),
        data: { title: 'Actividades' },
      },
      {
        path: 'revisiones',
        loadComponent: () =>
          import('./features/dashboard/pages/revisiones/revisiones').then((m) => m.Revisiones),
        data: { title: 'Revisiones' },
      },
      {
        path: 'citas',
        loadComponent: () => import('./features/dashboard/pages/citas/citas').then((m) => m.Citas),
        data: { title: 'Citas' },
      },
      {
        path: 'entregas',
        loadComponent: () =>
          import('./features/dashboard/pages/entregas/entregas').then((m) => m.Entregas),
        data: { title: 'Entregas' },
      },
      {
        path: 'cotejos',
        loadComponent: () =>
          import('./features/dashboard/pages/cotejos/cotejos').then((m) => m.Cotejos),
        data: { title: 'Cotejos' },
      },
      {
        path: 'expedientes',
        loadComponent: () =>
          import('./features/dashboard/pages/expedientes/expedientes').then((m) => m.Expedientes),
        data: { title: 'Expedientes' },
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/dashboard/pages/usuarios/usuarios').then((m) => m.Usuarios),
        data: { title: 'Usuarios' },
      },
      {
        path: 'galeria',
        loadComponent: () =>
          import('./features/dashboard/pages/galeria/galeria').then((m) => m.Galeria),
        data: { title: 'Galería' },
      },
    ],
  },

  {
    path: 'LoginDashboard',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginDashboard),
  },

  // DASHBOARD PRINCIPAL - LISTA DE ASPIRANTES (PROTEGIDO CON GUARD)
  {
    path: 'dashboard-tutor',
    canActivate: [authTutorGuard],
    loadComponent: () =>
      import('./features/dashboard-tutor/pages/overview/overview.page').then(
        (m) => m.OverviewComponent,
      ),
  },

  // REGISTRO DE NUEVO ASPIRANTE Y CARGA DE DOCUMENTOS (PROTEGIDO CON GUARD)
  {
    path: 'dashboard-tutor/register-flow',
    canActivate: [authTutorGuard],
    loadComponent: () =>
      import('./features/dashboard-tutor/pages/register-flow/register-flow.page').then(
        (m) => m.RegisterFlowComponent,
      ),
  },

  // Comodín por si escriben cualquier otra ruta (Redirige a la Landing)
  {
    path: '**',
    redirectTo: '',
  },
];
