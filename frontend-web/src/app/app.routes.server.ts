import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'releases/:slug', // A rota dinâmica que estava dando erro
    renderMode: RenderMode.Server // Define para SSR (renderiza na hora do acesso)
  },
  {
    path: '**', // Todas as outras rotas (Home, Sobre, etc)
    renderMode: RenderMode.Prerender // Continuam estáticas (mais rápidas)
  }
];
