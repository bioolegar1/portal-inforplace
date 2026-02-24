import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr'; // Confirme este import
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server'; // Confirme este import

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes) // A conexão real acontece aqui
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

