import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 1. IMPORTA ESTA LÍNEA
import { authInterceptor } from './core/interceptors/auth.dashboard.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
