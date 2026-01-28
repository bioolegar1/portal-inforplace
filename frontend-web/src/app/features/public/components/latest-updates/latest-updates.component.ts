import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-latest-updates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './latest-updates.component.html',
  styles: []
})
export class LatestUpdatesComponent {

  // Lista de atualizações (Mock - Dados fictícios para exemplo)
  updates = signal([
    {
      id: 1,
      date: '27 Jan, 2026',
      type: 'PILLAR', // Tipo da tag
      typeColor: 'bg-blue-100 text-blue-700 border-blue-200', // Cor da tag
      title: 'Módulo de Integração Bancária',
      description: 'Agora é possível conciliar extratos OFX automaticamente com o financeiro do Pillar.',
      link: '/release-hub' // Link para o detalhe (se houver) ou para o hub
    },
    {
      id: 2,
      date: '15 Jan, 2026',
      type: 'PDV',
      typeColor: 'bg-green-100 text-green-700 border-green-200',
      title: 'Performance no PDV',
      description: 'Otimizamos o carregamento de produtos no SAFE, tornando as vendas 3x mais rápidas.',
      link: '/release-hub'
    },
    {
      id: 3,
      date: '10 Jan, 2026',
      type: 'EMISSOR NF-e',
      typeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      title: 'Correção na emissão de CT-e',
      description: 'Resolvido problema de validação de schema na Sefaz para transportadoras de MG.',
      link: '/release-hub'
    }
  ]);
}
