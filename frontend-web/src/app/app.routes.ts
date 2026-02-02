import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Capa do Site (Institucional)
  {
    path: '',
    title: 'Inforplace Sistemas',
    // Lazy Loading: Só carrega o arquivo da Home quando acessar a raiz
    loadComponent: () => import('./features/public/home.component').then(m => m.HomeComponent)
  },

  // 2. Hub de Atualizações (A página verde bonita)
  {
    path: 'releases',
    title: 'Inforplace Notes - Novidades',
    loadComponent: () => import('./features/public/release-hub/release-hub.component').then(m => m.ReleaseHubComponent)
  },

  // 3. Detalhe da Nota (Quando clica em um card no Hub)
  {
    path: 'releases/:slug',
    title: 'Detalhes da Atualização',
    loadComponent: () => import('./features/public/components/release-detail/release-detail.component').then(m => m.ReleaseDetailComponent)
  },

  // 4. Sistema Pillar
  {
    path: 'pillar',
    title: 'Sistema Pillar - Gestão de Obras',
    loadComponent: () => import('./features/public/solutions/pillar/pillar.component').then(m => m.PillarComponent)
  },

  // 5. Sistema Safe
  {
    path: 'safe',
    title: 'Sistema Safe - Gestão Administrativa',
    loadComponent: () => import('./features/public/solutions/safe/safe.component').then(m => m.SafeComponent)
  },

  {
    path: 'obras',
    title: 'Custo de Obras - Gestao de Imobiliários',
    loadComponent: () => import('./features/public/solutions/obras/obras.component').then(m => m.ObrasComponent)
  },

  {
    path: 'pvinfo',
    title: 'PDV. Registre vendas,',
    loadComponent: () => import('./features/public/solutions/pvinfo/pvinfo.component').then(m => m.PvinfoComponent)
  },

  {
    path: 'notainfo',
    title: 'NOTAinfo - Emissor Fiscal',
    loadComponent: () => import('./features/public/solutions/notainfo/notainfo.component').then(m => m.NotainfoComponent)
  },

  {
    path: 'coletorxml',
    title: 'Coletor XML',
    loadComponent: () => import('./features/public/solutions/coletorxml/coletorxml.component').then(m => m.ColetorComponent)
  },

  {
    path: 'pillarmobile',
    title: 'Pillar Mobile',
    loadComponent:()=> import('./features/public/solutions/pillar-mobile/pillar-mobile.component').then(m => m.PillarMobileComponent)
  },

  // Rota coringa (Redirecionamento não precisa de lazy load)
  {
    path: '**',
    redirectTo: ''
  }
];
