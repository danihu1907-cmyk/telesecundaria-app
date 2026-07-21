import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.dashboard.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // MODIFICADO: SE IMPORTA withInterceptors

import { routes } from './app.routes';
import { authTutorInterceptor } from './core/interceptors/auth-tutor.interceptor'; // MODIFICADO: SE IMPORTA TU INTERCEPTOR REAL

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, authTutorInterceptor])),
  ],
};
