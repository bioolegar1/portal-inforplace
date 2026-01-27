import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
// 1. Importe o componente novo (Ajuste o caminho se sua pasta for diferente)

// Interface do FAQ
interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-pillar',
  standalone: true,
  // 2. Adicione o TestimonialsComponent nos imports
  imports: [CommonModule],
  templateUrl: './pillar.component.html',
  styles: [] // 3. CSS do Swiper removido (já está dentro do componente filho)
})
export class PillarComponent implements OnInit {

  // Features (Mantido)
  features = signal([
    { title: 'Compra', desc: 'Realiza solicitação de compra, cotação de preço e ordem de compra.', icon: 'shopping_cart' },
    { title: 'Estoque', desc: 'Controla as entradas e saídas de mercadoria aplicada na obra.', icon: 'inventory_2' },
    { title: 'Contábil', desc: 'Maior conforto, segurança e agilidade na integração do Sistema Contábil.', icon: 'calculate' },
    { title: 'Planejamento de Obra', desc: 'Controla todos elementos de receita de venda por período e acumulada.', icon: 'architecture' },
    { title: 'Financeiro', desc: 'Contas a pagar e receber, adiantamento financeiro e fluxo de caixa.', icon: 'payments' },
    { title: 'Escrita Fiscal', desc: 'Entrada e saída de documentos fiscais totalmente integrado ao financeiro.', icon: 'receipt_long' },
    { title: 'Manutenção', desc: 'Controle de manutenção de equipamentos e emissão de ordem de serviço.', icon: 'build' },
    { title: 'Patrimônio', desc: 'Venda, baixa, cálculo de depreciação e transferência de imobilizado.', icon: 'domain' },
    { title: 'Gestão de Clientes', desc: 'Sistema completo para construtoras, incorporadoras e administradoras.', icon: 'groups' }
  ]);

  // OBS: Removi a variável 'testimonials' pois ela agora vive dentro do <app-testimonials>

  // FAQ (Mantido)
  faqs = signal<FaqItem[]>([
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
      isOpen: true
    }
  ]);

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Sistema Pillar - Gestão para Construtoras | Inforplace');
    this.meta.updateTag({ name: 'description', content: 'O Sistema Pillar inova a administração da sua construtora. Controle de obras, financeiro e compras integrado.' });
  }

  // OBS: Removi ngAfterViewInit pois a lógica do Swiper agora é responsabilidade do componente filho

  toggleFaq(index: number) {
    this.faqs.update(items => {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        isOpen: !updatedItems[index].isOpen
      };
      return updatedItems;
    });
  }
}
