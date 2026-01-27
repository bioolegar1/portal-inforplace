import {
  Component,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';

// Garante o registro do Swiper
register();

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styles: [`
    :host ::ng-deep swiper-container::part(bullet) {
      background-color: rgba(255, 255, 255, 0.4);
      opacity: 1;
    }
    :host ::ng-deep swiper-container::part(bullet-active) {
      background-color: #ffffff;
      width: 24px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    :host ::ng-deep swiper-container::part(button-prev),
    :host ::ng-deep swiper-container::part(button-next) {
      color: rgba(255, 255, 255, 0.7);
    }
    :host ::ng-deep swiper-container::part(button-prev):hover,
    :host ::ng-deep swiper-container::part(button-next):hover {
      color: #ffffff;
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('heroSwiper') heroSwiperRef!: ElementRef;

  // 1. TEMA DO HERO SLIDER
  getHeroTheme(id: string) {
    const themes: any = {
      'pillar': {
        bg: 'bg-gradient-to-br from-[#0a1a3b] to-[#1e40af]',
        btn: 'bg-blue-600 hover:bg-blue-800 text-white shadow-blue-900/50',
        // Novo: Fundo azul escuro translúcido no hover
        imgPanel: 'hover:bg-[#0a1a3b]/80 hover:border-blue-400/50'
      },
      'gestao': {
        bg: 'bg-gradient-to-br from-[#052e16] to-[#15803d]',
        btn: 'bg-[#16a34a] hover:bg-[#14532d] text-white shadow-green-900/50',
        // Novo: Fundo verde escuro translúcido no hover
        imgPanel: 'hover:bg-[#052e16]/80 hover:border-green-400/50'
      },
      'obras': {
        bg: 'bg-gradient-to-br from-[#042f2e] to-[#0d9488]',
        btn: 'bg-teal-500 hover:bg-teal-700 text-white shadow-teal-900/50',
        imgPanel: 'hover:bg-[#042f2e]/80 hover:border-teal-400/50'
      },
      'pdv': {
        bg: 'bg-gradient-to-br from-[#111827] to-[#374151]',
        btn: 'bg-gray-600 hover:bg-gray-800 text-white shadow-gray-900/50',
        imgPanel: 'hover:bg-gray-900/90 hover:border-gray-500/50'
      },
      'nfe': {
        bg: 'bg-gradient-to-br from-[#0c4a6e] to-[#0284c7]',
        btn: 'bg-sky-500 hover:bg-sky-700 text-white shadow-sky-900/50',
        imgPanel: 'hover:bg-[#0c4a6e]/80 hover:border-sky-400/50'
      },
      'coletorxml': {
        bg: 'bg-gradient-to-br from-[#431407] to-[#ea580c]',
        btn: 'bg-orange-600 hover:bg-orange-800 text-white shadow-orange-900/50',
        imgPanel: 'hover:bg-[#431407]/80 hover:border-orange-400/50'
      }
    };
    return themes[id] || themes['gestao'];
  }

  // 2. TEMA DOS CARDS
  getCardTheme(id: string) {
    // 1. PILLAR azul
    if (id === 'pillar') {
      return {
        card: 'group hover:bg-blue-700 hover:border-blue-700 hover:shadow-blue-900/40 transition-all duration-300', // Escureci o bg do hover para 700
        iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-800 group-hover:text-white transition-colors duration-300',
        title: 'group-hover:text-white transition-colors duration-300',
        // AQUI ESTÁ A MUDANÇA DA FONTE:
        text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-blue-50 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
        detail: 'text-blue-600 group-hover:text-white transition-colors duration-300'
      };
    }

    // 2. GESTÃO (SAFE) (verde)
    if (id === 'safe') {
      return {
        card: 'group hover:bg-[#15803d] hover:border-[#15803d] hover:shadow-green-900/40 transition-all duration-300', // Verde mais escuro
        iconBg: 'bg-green-50 text-[#16a34a] group-hover:bg-green-900 group-hover:text-white transition-colors duration-300',
        title: 'group-hover:text-white transition-colors duration-300',
        text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-green-50 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
        detail: 'text-[#16a34a] group-hover:text-white transition-colors duration-300'
      };
    }

    // 3. CUSTO DE OBRA (Teal)
    if (id === 'obras') {
      return {
        card: 'group hover:bg-teal-700 hover:border-teal-700 hover:shadow-teal-900/40 transition-all duration-300',
        iconBg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-900 group-hover:text-white transition-colors duration-300',
        title: 'group-hover:text-white transition-colors duration-300',
        text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-teal-50 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
        detail: 'text-teal-600 group-hover:text-white transition-colors duration-300'
      };
    }

    // 4. PDV (Cinza Escuro)
    if (id === 'pdv') {
      return {
        card: 'group hover:bg-gray-900 hover:border-gray-900 hover:shadow-black/50 transition-all duration-300',
        iconBg: 'bg-gray-100 text-gray-700 group-hover:bg-black group-hover:text-white transition-colors duration-300',
        title: 'group-hover:text-white transition-colors duration-300',
        text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-gray-200 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
        detail: 'text-gray-600 group-hover:text-white transition-colors duration-300'
      };
    }

    // 5. EMISSOR NFE (Sky Blue)
    if (id === 'nfe') {
      return {
        card: 'group hover:bg-sky-600 hover:border-sky-600 hover:shadow-sky-900/40 transition-all duration-300',
        iconBg: 'bg-sky-50 text-sky-600 group-hover:bg-sky-900 group-hover:text-white transition-colors duration-300',
        title: 'group-hover:text-white transition-colors duration-300',
        text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-sky-50 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
        detail: 'text-sky-600 group-hover:text-white transition-colors duration-300'
      };
    }

    // 6. COLETOR XML (Laranja)
    if (id === 'coletorxml') {
      return {
        card: 'group hover:bg-orange-700 hover:border-orange-700 hover:shadow-orange-900/40 transition-all duration-300',
        iconBg: 'bg-orange-50 text-orange-600 group-hover:bg-orange-900 group-hover:text-white transition-colors duration-300',
        title: 'group-hover:text-white transition-colors duration-300',
        text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-orange-50 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
        detail: 'text-orange-600 group-hover:text-white transition-colors duration-300'
      };
    }

    // Fallback
    return {
      card: 'group hover:bg-blue-700 hover:border-blue-700 hover:shadow-blue-900/40 transition-all duration-300',
      iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300',
      title: 'group-hover:text-white transition-colors duration-300',
      text: 'text-gray-600 text-[10px] md:text-sm group-hover:text-blue-50 group-hover:text-base group-hover:leading-relaxed transition-all duration-300',
      detail: 'text-blue-600 group-hover:text-white transition-colors duration-300'
    };
  }
  // 3. DADOS
  solutions = signal([
    {
      id: 'pillar',
      name: 'Sistema Pillar',
      description: 'Sistema de gestão de construtoras e incorporadoras. O Sistema Pillar inovará a administração da sua empresa.',
      icon: 'pillar42x42.png'
    },
    {
      id: 'safe',
      name: 'SAFE',
      description: 'O segredo dos bons resultados de uma empresa está na eficiência. Gestão completa para o seu negócio.',
      icon: 'safe.png'
    },
    {
      id: 'obras',
      name: 'Custo de Obras',
      description: 'Gestão contábil e fiscal da construção civil e empreendimentos imobiliários, de acordo com as normas.',
      icon: 'custodeobras.png'
    },
    {
      id: 'pdv',
      name: 'Ponto de Venda',
      description: 'Aumente a eficiência de seu PDV. Registre vendas, estoque e ofereça um atendimento rápido aos clientes.',
      icon: 'vendafacil.png'
    },
    {
      id: 'nfe',
      name: 'Emissor NF-e',
      description: 'Emita nota fiscal eletrônica em poucos cliques. Uma solução simples e fácil de usar para sua empresa.',
      icon: 'pvinfo.png'
    },
    {
      id: 'coletorxml',
      name: 'Coletor XML',
      description: 'Programa que faz a baixa automática de XML de NF-e e CT-e, dando ciência da operação instantaneamente.',
      icon: 'Coletorxml.png'
    },
  ]);

  // INJETAR O PLATFORM_ID
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Inforplace Sistemas - Tecnologia em Alta Performance');
    this.meta.addTags([
      { name: 'description', content: 'Soluções focadas em levar o melhor da tecnologia, considerando a segurança e a confiabilidade. Conheça o Sistema Pillar, Gestão de Obras e NF-e.' },
      { name: 'keywords', content: 'Sistema Pillar, Gestão de Obras, NF-e, Coletor XML, PDV, Inforplace, ERP Goiânia' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Inforplace - Tecnologia em Alta Performance' },
      { property: 'og:description', content: 'Inovação para construtoras, varejo e gestão fiscal.' },
      { property: 'og:type', content: 'website' },
    ]);
  }

  // 4. INICIALIZAÇÃO SEGURA DO SWIPER
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.heroSwiperRef?.nativeElement) {
          const swiperEl = this.heroSwiperRef.nativeElement;

          const params = {
            slidesPerView: 1,
            loop: true,
            effect: 'slide',
            speed: 600, // Reduzi de 800 para 600ms (transição mais ágil)

            autoplay: {
              delay: 3500,            // Reduzi de 6000 para 3500ms (troca de slide mais rápida)
              disableOnInteraction: false,
              pauseOnMouseEnter: true // ISSO GARANTE QUE PARA AO COLOCAR O MOUSE
            },

            pagination: { clickable: true, dynamicBullets: true },
            navigation: true,
          };

          Object.assign(swiperEl, params);

          if (typeof swiperEl.initialize === 'function') {
            swiperEl.initialize();
          }
        }
      }, 0);
    }
  }
}
