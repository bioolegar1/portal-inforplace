import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Input
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-testimonials',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './testmonials.component.html',
  styles: [`
    :host { display: block; }
    :host ::ng-deep swiper-container::part(container) {
      padding-top: 60px !important;
      padding-bottom: 60px !important;
    }
  `]
})
export class TestimonialsComponent implements AfterViewInit {

  @ViewChild('swiperRef') swiperRef!: ElementRef;

  @Input() title: string = 'O que dizem nossos clientes';

  // NOVA VARIÁVEL: Define a cor de fundo (Padrão: Azul do Pillar)
  // Aceita qualquer classe de cor do Tailwind, ex: 'bg-[#16a34a]'
  @Input() bgClass: string = 'bg-[#1e40af]';

  testimonials = signal([
    {
      name: 'David Alkmim',
      company: 'FonteNet',
      text: 'Fico feliz em ver que está no mercado profissionais de excelente qualidade e compromisso.'
    },
    {
      name: 'Maria Dolores',
      company: 'Web Treinamentos - PA',
      text: 'Uso o Pillar há algum tempo, tive algumas dificuldades no início, mas hoje estou feliz com o sistema.'
    },
    {
      name: 'Carlos Silva',
      company: 'Construtora Silva',
      text: 'O sistema Pillar mudou a forma como gerenciamos nossas obras. Incrível!'
    },
    // ... seus outros dados
  ]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.swiperRef?.nativeElement) {
          const swiperEl = this.swiperRef.nativeElement;
          Object.assign(swiperEl, {
            slidesPerView: 'auto',
            spaceBetween: 30,
            speed: 5000,
            loop: true,
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }
          });
          swiperEl.initialize();

          setTimeout(() => {
            swiperEl.swiper?.autoplay?.start();
          }, 100);
        }
      }, 50);
    }
  }
}
