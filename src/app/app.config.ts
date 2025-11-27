import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// 1. Importamos withInterceptors
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// 2. Importamos el interceptor que acabamos de crear
import { authInterceptor } from './custom/auth.interceptor'; // Ajusta la ruta si lo guardaste en otro lado

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 3. Configuramos el HttpClient con el interceptor
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
