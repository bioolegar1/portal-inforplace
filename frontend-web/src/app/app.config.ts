import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router'; // 1. Importe o withInMemoryScrolling
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Configure o Router com as opções de scroll
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Força a página a rolar para o topo na navegação
        anchorScrolling: 'enabled'        // Permite usar links com âncora (ex: #contato) com scroll suave
      })
    ),

    provideClientHydration(),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // Removi a duplicata (estava duas vezes)
    )
  ]
};
