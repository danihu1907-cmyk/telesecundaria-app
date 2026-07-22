import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTutorService } from '../services/auth-tutor.service'; // RUTA AJUSTADA A TU SERVICIO GLOBAL EN CORE
import { catchError, switchMap, throwError } from 'rxjs';

export const authTutorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthTutorService);
  const router = inject(Router);

  // OBTENEMOS EL TOKEN EN TIEMPO REAL DESDE EL SIGNAL DE MEMORIA RAM
  const token = authService.tokenActual();

  console.log('INTERCEPTOR HTTP: GESTIONANDO PETICIÓN HACIA:', req.url);

  let peticion = req;

  // SI EL TUTOR TIENE UN TOKEN, CLONAMOS LA PETICIÓN Y LE AGREGAMOS EL HEADER DE PRIVACIDAD
  if (token) {
    console.log(' INYECTANDO TOKEN DE CONTROL ESCOLAR EN LAS CABECERAS DE LA PETICIÓN.');
    peticion = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, //NECESARIO PARA QUE VIAJE LA COOKIE DEL REFRESH TOKEN
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
              withCredentials: true,
            });
            return next(peticionRenovada);
          }),
          catchError((errorRefresh) => {
            // SI EL SERVIDOR RESPONDE 401 SIGNIFICA QUE EL TOKEN EXPIRÓ O LA SESIÓN SE CERRÓ EN EL BACKEND
            console.warn(
              'INTERCEPTOR HTTP: TOKEN INVÁLIDO O EXPIRADO (401). LIMPIANDO ESTADO Y EXPULSANDO AL USUARIO.',
            );

            // CORRECCIÓN CLAVE: INVOCAMOS LA FUNCIÓN DE CERRAR SESIÓN DE TU SERVICIO PARA BORRAR LOCALSTORAGE
            authService.cerrarSesion();

            // REDIRIGIMOS INMEDIATAMENTE AL LOGIN
            router.navigate(['/login']);

            return throwError(() => errorRefresh);
          }),
        );
      }

      // SI EL SERVIDOR RESPONDE 401 SIGNIFICA QUE EL TOKEN EXPIRÓ O LA SESIÓN SE CERRÓ EN EL BACKEND
      if (error.status === 401) {
        console.warn(
          'INTERCEPTOR HTTP: TOKEN INVÁLIDO O EXPIRADO (401). LIMPIANDO ESTADO Y EXPULSANDO AL USUARIO.',
        );

        // CORRECCIÓN CLAVE: INVOCAMOS LA FUNCIÓN DE CERRAR SESIÓN DE TU SERVICIO PARA BORRAR LOCALSTORAGE
        authService.cerrarSesion();

        // REDIRIGIMOS INMEDIATAMENTE AL LOGIN
        router.navigate(['/login']);
      }

      // DEVOLVEMOS EL ERROR PARA QUE EL COMPONENTE TAMBIÉN SE ENTERE SI ES NECESARIO
      return throwError(() => error);
    }),
  );
};
