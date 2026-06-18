/* import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';
import { authTutorGuard } from './core/guards/auth-tutor.guard'; // IMPORTANTE: IMPORTAMOS EL NUEVO GUARD DE CONTROL INTEGRAL

export const routes: Routes = [
  // Página principal o Landing Page pública
  {
    path: '',
    component: LandingPage,
  },

  // Redirección por defecto si entran a /auth a secas -> Ahora va al Welcome
  {
    path: 'auth',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },

  // PANTALLAS DE AUTENTICACIÓN INDEPENDIENTES (TODAS SON PÚBLICAS Y EXISTEN)
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

  // =========================================================================
  // NOTA EN MAYÚSCULAS PARA EL FUTURO:
  // CUANDO TU EQUIPO GENERE LAS CARPETAS DEL DASHBOARD O FORMULARIOS DE INSCRIPCIÓN,
  // SÓLO DEBERÁS COPIAR EL SIGUIENTE BLOQUE AQUÍ ABAJO PARA PROTEGERLAS:
  //
  // {
  //   path: 'dashboard',
  //   canActivate: [authTutorGuard],
  //   loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage)
  // }
  // =========================================================================

  // Comodín por si escriben cualquier otra ruta (Redirige a la Landing)
  {
    path: '**',
    redirectTo: '',
  },
];
 */
import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';
import { authTutorGuard } from './core/guards/auth-tutor.guard';

export const routes: Routes = [
  // PAGINA PRINCIPAL O LANDING PAGE PUBLICA
  {
    path: '',
    component: LandingPage,
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

  // =========================================================================
  // NOTA EN MAYUSCULAS PARA EL FUTURO:
  // CUANDO TU EQUIPO GENERE LAS CARPETAS DEL DASHBOARD O FORMULARIOS DE INSCRIPCION,
  // SOLO DEBERAS COPIAR EL SIGUIENTE BLOQUE AQUI ABAJO PARA PROTEGERLAS:
  //
  // {
  //   path: 'dashboard',
  //   canActivate: [authTutorGuard],
  //   loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage)
  // }
  // =========================================================================

  // DASHBOARD PRINCIPAL - LISTA DE ASPIRANTES (PROTEGIDO CON GUARD)
  {
    path: 'dashboard',
    canActivate: [authTutorGuard],
    loadComponent: () =>
      import('./features/dashboard-tutor/pages/overview/overview.page').then(
        (m) => m.OverviewComponent,
      ),
  },

  // REGISTRO DE NUEVO ASPIRANTE Y CARGA DE DOCUMENTOS (PROTEGIDO CON GUARD)
  {
    path: 'dashboard/register-flow',
    canActivate: [authTutorGuard],
    loadComponent: () =>
      import('./features/dashboard-tutor/pages/register-flow/register-flow.page').then(
        (m) => m.RegisterFlowComponent,
      ),
  },

  // COMODIN POR SI ESCRIBEN CUALQUIER OTRA RUTA (REDIRIGE A LA LANDING)
  {
    path: '**',
    redirectTo: '',
  },
];
