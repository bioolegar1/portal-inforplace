import { Routes } from '@angular/router';

export const routes: Routes = [
  // =========================================================
  // 🟢 ÁREA PÚBLICA (Seu site atual)
  // =========================================================

  // 1. Capa do Site (Institucional)
  {
    path: '',
    title: 'Inforplace Sistemas',
    loadComponent: () => import('./features/public/home.component').then(m => m.HomeComponent)
  },

  // 2. Hub de Atualizações
  {
    path: 'releases',
    title: 'Inforplace Notes - Novidades',
    loadComponent: () => import('./features/public/release-hub/release-hub.component').then(m => m.ReleaseHubComponent)
  },

  // 3. Detalhe da Nota
  {
    path: 'releases/:slug',
    title: 'Detalhes da Atualização',
    loadComponent: () => import('./features/public/components/release-detail/release-detail.component').then(m => m.ReleaseDetailComponent)
  },

  // 4. Soluções (Pillar, Safe, Obras, etc...)
  {
    path: 'pillar',
    title: 'Sistema Pillar - Gestão de Obras',
    loadComponent: () => import('./features/public/solutions/pillar/pillar.component').then(m => m.PillarComponent)
  },
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

  // =========================================================
  // 🔐 ÁREA ADMINISTRATIVA (Novas Rotas)
  // =========================================================

  // 1. Login (Sem Layout - Tela Cheia)
  {
    path: 'admin/login',
    title: 'Login - Portal Inforplace',
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent)
  },

  // 2. Painel Admin (Com Layout: Sidebar + Header)
  {
    path: 'admin',
    // Carrega o Layout que segura todas as páginas internas
    loadComponent: () => import('./features/admin/layout/layout.component').then(m => m.AdminLayoutComponent),
    children: [
      // Se acessar /admin direto, joga para o dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        title: 'Dashboard - Inforplace',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Gerenciamento de Releases (Lista)
      {
        path: 'releases',
        title: 'Gerenciar Releases',
        loadComponent: () => import('./features/admin/releases/release-list/release-list.component').then(m => m.ReleaseListComponent)
      },

      // Editor de Releases (Criar Novo)
      {
        path: 'releases/new',
        title: 'Nova Release',
        loadComponent: () => import('./features/admin/releases/release-editor/release-editor.component').then(m => m.ReleaseEditorComponent)
      },

      // Editor de Releases (Editar Existente)
      {
        path: 'releases/:id',
        title: 'Editar Release',
        loadComponent: () => import('./features/admin/releases/release-editor/release-editor.component').then(m => m.ReleaseEditorComponent)
      },

      // Usuários
      {
        path: 'users',
        title: 'Gerenciar Usuários',
        loadComponent: () => import('./features/admin/users/users-list.component').then(m => m.UserListComponent)
      },

      // Configurações
      {
        path: 'settings',
        title: 'Configurações',
        loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // =========================================================
  // ⚠️ ROTA CORINGA (Sempre por último)
  // =========================================================
  {
    path: '**',
    redirectTo: ''
  }
];
