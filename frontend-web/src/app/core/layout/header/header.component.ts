import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  // Lista de Soluções (já existente)
  solutionsMenu = signal([
    { name: 'Sistema Pillar', icon: 'pillar42x42.png', link: '/pillar' },
    { name: 'Sistema SAFE', icon: 'safe.png', link: '/safe' },
    { name: 'Custo de Obras', icon: 'custodeobras.png', link: '/obras' },
    { name: 'PDV - Ponto de Venda', icon: 'pvinfo.png', link: '/pdv' },
    { name: 'Emissor NF-e', icon: 'sao.png', link: '/nfe' },
    { name: 'Coletor XML', icon: 'Coletorxml.png', link: '/coletor' }
  ]);

  // --- NOVA LÓGICA DO MENU MOBILE ---

  // 1. Controle se o menu principal está aberto
  isMobileMenuOpen = signal(false);

  // 2. Controle se o submenu "Soluções" dentro do mobile está aberto
  isMobileSolutionsOpen = signal(false);

  // Alterna o menu principal
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  // Alterna o submenu de soluções no mobile
  toggleMobileSolutions() {
    this.isMobileSolutionsOpen.update(v => !v);
  }

  // Fecha tudo (usado ao clicar em um link)
  closeMenu() {
    this.isMobileMenuOpen.set(false);
    this.isMobileSolutionsOpen.set(false);
  }
}
