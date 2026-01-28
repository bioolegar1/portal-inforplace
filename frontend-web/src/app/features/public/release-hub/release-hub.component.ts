import { Component, signal, ChangeDetectionStrategy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-release-hub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule ],
  templateUrl: './release-hub.component.html', // Aponta para o HTML do release-hub
  styleUrl: './release-hub.component.css'
})
export class ReleaseHubComponent {
  // ... COPIE AQUI TODAS AS VARIÁVEIS (products, recentReleases) E MÉTODOS QUE FIZEMOS ANTES ...
  // Vou resumir aqui para não ficar gigante, mas é exatamente o mesmo conteúdo do TS anterior.

  products = signal([
    { id: 'safe', name: 'SAFE', desc: 'Gestão administrativa...', icon: '📊' },
    { id: 'pillar', name: 'Pillar', desc: 'Solução robusta...', icon: '🏛️' },
    { id: 'nfi', name: 'NFI', desc: 'Gerenciador inteligente...', icon: '🧾' }
  ]);

  recentReleases = signal([
    // ... seus dados mockados ...
    {
      id: 1,
      slug: 'nfi-atualizacao-sefaz',
      title: 'Adequação à Nota Técnica 2025.001',
      summary: 'Atualizamos as regras de validação...',
      version: 'v3.1.2',
      date: 'Hoje',
      product: 'NFI'
    },
    // ... etc
  ]);

  constructor(private router: Router) {}

  filterByProduct(productId: string): void {
    this.router.navigate(['/releases/list'], { queryParams: { product: productId } });
  }
}
