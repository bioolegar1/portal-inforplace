import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  // Dados extraídos do site oficial da Inforplace
  solutions = signal([
    {
      id: 'pillar',
      name: 'Sistema Pillar',
      description: 'Sistema de gestão de construtoras e incorporadoras. O Sistema Pillar inovará a administração da sua empresa.',
      icon: '🏗️'
    },
    {
      id: 'gestao',
      name: 'Sistema de Gestão',
      description: 'O segredo dos bons resultados de uma empresa está na eficiência. Gestão completa para o seu negócio.',
      icon: '🚀'
    },
    {
      id: 'obras',
      name: 'Custo de Obras',
      description: 'Gestão contábil e fiscal da construção civil e empreendimentos imobiliários, de acordo com as normas.',
      icon: '📐'
    },
    {
      id: 'pdv',
      name: 'Ponto de Venda',
      description: 'Aumente a eficiência de seu PDV. Registre vendas, estoque e ofereça um atendimento rápido aos clientes.',
      icon: '🛒'
    },
    {
      id: 'nfe',
      name: 'Emissor NF-e',
      description: 'Emita nota fiscal eletrônica em poucos cliques. Uma solução simples e fácil de usar para sua empresa.',
      icon: '🧾'
    },
    {
      id: 'coletor',
      name: 'Coletor XML',
      description: 'Programa que faz a baixa automática de XML de NF-e e CT-e, dando ciência da operação instantaneamente.',
      icon: '📥'
    }
  ]);

  constructor(private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    // SEO Atualizado com a nova copy
    this.title.setTitle('Inforplace Sistemas - Tecnologia em Alta Performance');

    this.meta.addTags([
      { name: 'description', content: 'Soluções focadas em levar o melhor da tecnologia, considerando a segurança e a confiabilidade. Conheça o Sistema Pillar, Gestão de Obras e NF-e.' },
      { name: 'keywords', content: 'Sistema Pillar, Gestão de Obras, NF-e, Coletor XML, PDV, Inforplace, ERP Goiânia' },
      { name: 'robots', content: 'index, follow' },

      // Open Graph
      { property: 'og:title', content: 'Inforplace - Tecnologia em Alta Performance' },
      { property: 'og:description', content: 'Inovação para construtoras, varejo e gestão fiscal.' },
      { property: 'og:type', content: 'website' },
    ]);
  }
}
