import { Routes } from '@angular/router';
import {HomeComponent} from './features/public/home.component';
import {ReleaseHubComponent} from './features/public/release-hub/release-hub.component';
import {ReleaseDetailComponent} from './features/public/components/release-detail/release-detail.component';
import {PillarComponent} from './features/public/solutions/pillar/pillar.component';
import {SafeComponent} from './features/public/solutions/safe/safe.component';

// Seus imports


export const routes: Routes = [
  // 1. Capa do Site (Institucional)
  {
    path: '',
    component: HomeComponent,
    title: 'Inforplace Sistemas'
  },

  // 2. Hub de Atualizações (A página verde bonita)
  {
    path: 'releases',
    component: ReleaseHubComponent,
    title: 'Inforplace Notes - Novidades'
  },

  // 3. Detalhe da Nota (Quando clica em um card no Hub)
  {
    path: 'releases/:slug',
    component: ReleaseDetailComponent,
    title: 'Detalhes da Atualização'
  },

  {
    path: 'pillar',
    component: PillarComponent,
    title: 'Sistema Pillar - Gestão de Obras'
  },

  {
    path: 'safe',
    component: SafeComponent,
    title: 'Sistema Safe - Gestão Administrativa'
  },

  // Rota coringa
  {
    path: '**',
    redirectTo: ''
  }
];
