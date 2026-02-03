import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Interface simples (idealmente estaria em models/release.interface.ts)
interface ReleaseSummary {
  id: string;
  title: string;
  version: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  date: string;
  author: string;
}

@Component({
  selector: 'app-release-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.css']
})
export class ReleaseListComponent {

  // Filtros
  searchTerm = signal('');
  statusFilter = signal('all');

  // Dados Mockados (Substitua depois pela chamada do Service)
  releases = signal<ReleaseSummary[]>([
    { id: '1', title: 'Atualização do Módulo Fiscal', version: '2.4.0', category: 'Fiscal', status: 'published', date: '2026-02-01', author: 'Admin' },
    { id: '2', title: 'Correção de Login no Mobile', version: '1.0.5', category: 'Mobile', status: 'draft', date: '2026-02-03', author: 'Carlos' },
    { id: '3', title: 'Novo Dashboard Financeiro', version: '3.1.0', category: 'Pillar', status: 'published', date: '2026-01-28', author: 'Mariana' },
    { id: '4', title: 'Melhorias de Performance', version: '2.4.1', category: 'Fiscal', status: 'archived', date: '2025-12-15', author: 'Admin' },
    { id: '5', title: 'Integração com WhatsApp', version: '1.2.0', category: 'Safe', status: 'draft', date: '2026-02-02', author: 'Admin' },
  ]);

  // Lógica de Filtragem Automática (Computed Signal)
  filteredReleases = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return this.releases().filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(term) ||
        r.version.toLowerCase().includes(term) ||
        r.category.toLowerCase().includes(term);

      const matchesStatus = status === 'all' || r.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  // Ações
  deleteRelease(id: string) {
    if(confirm('Tem certeza que deseja excluir esta publicação?')) {
      this.releases.update(list => list.filter(r => r.id !== id));
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado'
    };
    return labels[status] || status;
  }
}
