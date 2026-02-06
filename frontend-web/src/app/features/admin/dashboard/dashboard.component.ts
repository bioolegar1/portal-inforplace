import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../core/services/auth.service';
import {DashboardService, DashboardStats} from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  public authService = inject(AuthService); // Público para usar no template

  isLoading = signal(true);
  error = signal('');

  // 1. Saudação dinâmica (Bom dia/tarde/noite)
  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  // 2. Stats formatado como ARRAY para o *ngFor do HTML
  // Inicializamos com zeros para o layout não quebrar antes de carregar
  stats = signal([
    { title: 'Total Releases', value: 0, icon: '📝', color: 'bg-blue-500' },
    { title: 'Publicados', value: 0, icon: '✅', color: 'bg-green-500' },
    { title: 'Usuários', value: 0, icon: '👥', color: 'bg-purple-500' },
    { title: 'Visualizações', value: 0, icon: '👁️', color: 'bg-orange-500' }
  ]);

  // 3. Atividades Recentes (Mockado para o HTML não dar erro)
  recentActivities = signal([
    { text: 'Sistema inicializado', time: 'Agora mesmo', type: 'info' },
    { text: 'Sincronização de dados concluída', time: '5 min atrás', type: 'success' },
    { text: 'Backup automático realizado', time: '1 hora atrás', type: 'warning' }
  ]);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading.set(true);

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        // Mapeia o objeto da API para o Array de Cards que o HTML espera
        this.stats.set([
          { title: 'Total Releases', value: data.totalReleases, icon: '📝', color: 'bg-blue-500' },
          { title: 'Publicados', value: data.publishedReleases, icon: '✅', color: 'bg-green-500' },
          { title: 'Usuários', value: data.totalUsers, icon: '👥', color: 'bg-purple-500' },
          { title: 'Visualizações', value: data.totalViews, icon: '👁️', color: 'bg-orange-500' }
        ]);

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.error.set('Não foi possível carregar os dados.');
        this.isLoading.set(false);
      }
    });
  }
}
