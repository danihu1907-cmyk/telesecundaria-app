import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTutorService } from '../services/auth-tutor.service'; //  RUTA AJUSTADA A TU SERVICIO GLOBAL EN CORE

export const authTutorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthTutorService);

  // OBTENEMOS EL TOKEN EN TIEMPO REAL DESDE EL SIGNAL DE MEMORIA RAM
  const token = authService.tokenActual();

  console.log('INTERCEPTOR HTTP: GESTIONANDO PETICIÓN HACIA:', req.url);

  // SI EL TUTOR TIENE UN TOKEN, CLONAMOS LA PETICIÓN Y LE AGREGAMOS EL HEADER DE PRIVACIDAD
  if (token) {
    console.log(' INYECTANDO TOKEN DE CONTROL ESCOLAR EN LAS CABECERAS DE LA PETICIÓN.');
    const reqClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(reqClonada);
  }

  // SI NO HAY TOKEN (COMO EN EL LOGIN O REGISTRO), LA PETICIÓN PASA LIBREMENTE
  return next(req);
};
