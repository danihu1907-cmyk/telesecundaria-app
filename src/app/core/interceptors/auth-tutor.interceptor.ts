import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTutorService } from '../services/auth-tutor.service'; // RUTA AJUSTADA A TU SERVICIO GLOBAL EN CORE
import { catchError, switchMap, throwError } from 'rxjs';

export const authTutorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthTutorService);
  const router = inject(Router);

  // FILTRO CLAVE: ESTE INTERCEPTOR SOLO DEBE ACTUAR SOBRE ENDPOINTS QUE EXIGEN [Authorize(Roles = "Tutor")]
  // EN EL BACKEND. HOY ESO SOLO APLICA A LAS RUTAS DE AUTH Y REGISTRO DE TUTOR ASPIRANTE.
  // AdjuncionesController NO TIENE [Authorize], ASÍ QUE NO SE INCLUYE ACÁ.
  const esRutaDeTutor = req.url.includes('/Auth/Tutor') || req.url.includes('/TutorAspirante');

  // SI LA PETICIÓN NO ES DE TUTOR, LA DEJAMOS PASAR INTACTA (OTRO INTERCEPTOR O NINGUNO SE ENCARGA)
  if (!esRutaDeTutor) {
    return next(req);
  }

  // OBTENEMOS EL TOKEN EN TIEMPO REAL DESDE EL SIGNAL DE MEMORIA RAM
  const token = authService.tokenActual();
  let peticion = req;

  // SI EL TUTOR TIENE UN TOKEN, CLONAMOS LA PETICIÓN Y LE AGREGAMOS EL HEADER DE AUTORIZACIÓN
  // NOTA: NO SE MANDA withCredentials AQUÍ. ESTA PETICIÓN SOLO NECESITA EL JWT EN EL HEADER;
  // LA COOKIE DEL REFRESH TOKEN SOLO LA USA EL MÉTODO refreshToken() DEL SERVICIO.
  if (token) {
    peticion = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ENVIAMOS LA PETICIÓN Y ESCUCHAMOS POSIBLES ERRORES DE AUTORIZACIÓN (HTTP 401)
  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // SI EL TOKEN EXPIRÓ (401) Y NO ES LA PROPIA PETICIÓN DE REFRESH, INTENTAMOS RENOVARLO PRIMERO
      if (error.status === 401 && !req.url.includes('refresh-token')) {
        console.warn(
          'INTERCEPTOR HTTP: TOKEN EXPIRADO (401). INTENTANDO RENOVAR CON REFRESH TOKEN.',
        );

        return authService.refreshToken().pipe(
          switchMap((respuesta) => {
            const peticionRenovada = req.clone({
              setHeaders: { Authorization: `Bearer ${respuesta.token}` },
            });
            return next(peticionRenovada);
          }),
          catchError((errorRefresh) => {
            console.warn(
              'INTERCEPTOR HTTP: TOKEN INVÁLIDO O EXPIRADO (401). LIMPIANDO ESTADO Y EXPULSANDO AL USUARIO.',
            );
            authService.cerrarSesion();
            router.navigate(['/login']);
            return throwError(() => errorRefresh);
          }),
        );
      }

      if (error.status === 401) {
        console.warn(
          'INTERCEPTOR HTTP: TOKEN INVÁLIDO O EXPIRADO (401). LIMPIANDO ESTADO Y EXPULSANDO AL USUARIO.',
        );
        authService.cerrarSesion();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
