import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // MODIFICADO: SE IMPORTA withInterceptors

import { routes } from './app.routes';
import { authTutorInterceptor } from './core/interceptors/auth-tutor.interceptor'; // MODIFICADO: SE IMPORTA TU INTERCEPTOR REAL

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // MODIFICADO: SE INYECTA EL INTERCEPTOR DENTRO DE LA CONFIGURACIÓN DEL CLIENTE HTTP
    provideHttpClient(withInterceptors([authTutorInterceptor])),
  ],
};
