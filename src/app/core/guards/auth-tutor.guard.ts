import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTutorService } from '../services/auth-tutor.service'; // RUTA APUNTANDO A TU SERVICIO GLOBAL EN EL CORE

export const authTutorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthTutorService);
  const router = inject(Router);

  console.log('GUARD DE SEGURIDAD EXCLUSIVO: EVALUANDO INTENTO DE NAVEGACIÓN A:', state.url);

  // REGLA CLAVE 1: EL TUTOR DEBE TENER UN TOKEN EN EL LOCALSTORAGE (SESIÓN INICIADA)
  if (!authService.sesionActiva()) {
    console.warn('ACCESO DENEGADO POR EL GUARD: NO EXISTE SESIÓN ACTIVA. REDIRIGIENDO AL LOGIN.');
    router.navigate(['/login']);
    return false;
  }

  // REGLA CLAVE 2: LA CONVOCATORIA DEBE ESTAR ABIERTA EN EL SISTEMA
  // SI EN TU SERVICIO CAMBIAS EL SIGNAL A FALSE, ESTA REGLA COMPROBARÁ EL BLOQUEO INMEDIATO
  if (!authService.convocatoriaActiva()) {
    console.warn(
      'ACCESO DENEGADO POR EL GUARD: EL PERIODO DE CONVOCATORIA ESTÁ CERRADO O INACTIVO.',
    );

    // SI LA CONVOCATORIA ESTÁ CERRADA, EXPULSAMOS AL TUTOR A LA PÁGINA DE BIENVENIDA GENERAL
    router.navigate(['/welcome']);
    return false;
  }

  // SI EL TUTOR ESTÁ AUTENTICADO Y LA CONVOCATORIA EXISTE ABIERTA, CONCEDE EL PASO
  console.log('VALIDACIÓN EXITOSA: EL TUTOR TIENE ACCESO AUTORIZADO A LA RUTA PRIVADA.');
  return true;
};
