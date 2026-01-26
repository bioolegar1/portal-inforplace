  import { Component, OnInit, signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  import { Meta, Title } from '@angular/platform-browser';

  @Component({
    selector: 'app-pillar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './pillar.component.html',
  })
  export class PillarComponent implements OnInit {

    // 1. Funcionalidades (Dados para os Cards)
    features = signal([
      {
        title: 'Compra',
        desc: 'Realiza solicitação de compra, cotação de preço e ordem de compra.',
        icon: 'shopping_cart'
      },
      {
        title: 'Estoque',
        desc: 'Controla as entradas e saídas de mercadoria aplicada na obra.',
        icon: 'inventory_2'
      },
      {
        title: 'Contábil',
        desc: 'Maior conforto, segurança e agilidade na integração do Sistema Contábil.',
        icon: 'calculate'
      },
      {
        title: 'Planejamento de Obra',
        desc: 'Controla todos elementos de receita de venda por período e acumulada.',
        icon: 'architecture'
      },
      {
        title: 'Financeiro',
        desc: 'Contas a pagar e receber, adiantamento financeiro e fluxo de caixa.',
        icon: 'payments'
      },
      {
        title: 'Escrita Fiscal',
        desc: 'Entrada e saída de documentos fiscais totalmente integrado ao financeiro.',
        icon: 'receipt_long'
      },
      {
        title: 'Manutenção',
        desc: 'Controle de manutenção de equipamentos e emissão de ordem de serviço.',
        icon: 'build'
      },
      {
        title: 'Patrimônio',
        desc: 'Venda, baixa, cálculo de depreciação e transferência de imobilizado.',
        icon: 'domain'
      },
      {
        title: 'Gestão de Clientes',
        desc: 'Sistema completo para construtoras, incorporadoras e administradoras.',
        icon: 'groups'
      }
    ]);

    // 2. Depoimentos dos Clientes
    testimonials = signal([
      {
        name: 'David Alkmim',
        company: 'FonteNet',
        text: 'Fico feliz em ver que está no mercado profissionais de excelente qualidade e compromisso, formadores de opiniões com a credibilidade alicerçada por uma eficiente equipe.'
      },
      {
        name: 'Maria Dolores',
        company: 'Web Treinamentos - PA',
        text: 'Uso o Pillar há algum tempo, tive algumas dificuldades no início, mas hoje estou feliz com o sistema. Ele me atende com satisfação e conto com apoio total da equipe.'
      }
    ]);

    // 3. Perguntas Frequentes (FAQ)
    faqs = signal([
      {
        question: 'O que é o planejamento de obra?',
        answer: 'É o módulo onde você define o cronograma físico-financeiro, controlando etapas, custos previstos e realizados para garantir a saúde financeira do empreendimento.',
        isOpen: false
      },
      {
        question: 'Como faço para acessar o sistema remotamente?',
        answer: 'O Pillar permite acesso remoto seguro via TS (Terminal Service) ou VPN, garantindo que você gerencie suas obras de qualquer lugar.',
        isOpen: false
      },
      {
        question: 'Quantas empresas posso ter no meu sistema?',
        answer: 'O sistema é multiempresa. Você pode gerenciar múltiplas obras e CNPJs diferentes dentro da mesma licença, conforme seu plano.',
        isOpen: false
      },
      {
        question: 'Quais clientes podem utilizar o Pillar?',
        answer: 'Construtoras, Incorporadoras, Empreiteiras e Administradoras de Carteira Imobiliária que buscam gestão profissional.',
        isOpen: false
      },
      {
        question: 'Qual o custo mensal do Pillar?',
        answer: 'Nós da Inforplace mantemos a política de preço conforme o número de usuários e quantidade de empresas. Nosso preço é competitivo e oferecemos atendimento personalizado.',
        isOpen: true // Aberto por padrão para destaque
      }
    ]);

    constructor(private meta: Meta, private title: Title) {}

    ngOnInit(): void {
      // REMOVIDO: window.scrollTo(0, 0); -> Isso causava o erro no servidor.
      // A rolagem agora é controlada automaticamente pelo app.config.ts

      // SEO da Página
      this.title.setTitle('Sistema Pillar - Gestão para Construtoras | Inforplace');
      this.meta.updateTag({ name: 'description', content: 'O Sistema Pillar inova a administração da sua construtora. Controle de obras, financeiro e compras integrado.' });
    }

    // Lógica para abrir/fechar o FAQ
    toggleFaq(index: number) {
      this.faqs.update(items => {
        // Inverte o estado do item clicado (abre se fechado, fecha se aberto)
        items[index].isOpen = !items[index].isOpen;
        return [...items];
      });
    }
  }
