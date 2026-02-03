import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  greeting = this.getGreeting();

  stats = [
    {
      label: 'Total de Releases',
      value: '124',
      change: '+12%',
      trend: 'up',
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
      color: 'bg-blue-500'
    },
    {
      label: 'Leituras Hoje',
      value: '1,293',
      change: '+5%',
      trend: 'up',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      color: 'bg-green-500'
    },
    {
      label: 'Rascunhos Pendentes',
      value: '4',
      change: '-1',
      trend: 'down',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      color: 'bg-yellow-500'
    },
    {
      label: 'Usuários Ativos',
      value: '8',
      change: '0%',
      trend: 'neutral',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'bg-purple-500'
    },
  ];

  recentActivities = [
    { user: 'Admin', action: 'publicou a release', target: 'Pillar v2.4.0', time: '2 horas atrás', type: 'publish' },
    { user: 'Carlos Editor', action: 'atualizou o rascunho', target: 'Manutenção Safe', time: '5 horas atrás', type: 'edit' },
    { user: 'Sistema', action: 'backup automático', target: 'Database Daily', time: '1 dia atrás', type: 'system' },
    { user: 'Admin', action: 'criou novo usuário', target: 'Mariana Silva', time: '2 dias atrás', type: 'user' },
  ];

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }
}

