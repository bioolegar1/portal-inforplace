import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
// 1. Import do componente de depoimentos
import { TestimonialsComponent } from '../../../../core/layout/testmonials/testmonials.component';

// Interface para tipar o FAQ (boa prática)
interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-safe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // 2. Adicionamos o TestimonialsComponent aqui
  imports: [CommonModule, TestimonialsComponent],
  templateUrl: './safe.component.html',
  styles: []
})
export class SafeComponent implements OnInit {

  // 3. Funcionalidades (Dados do SAFE)
  features = signal([
    { icon: 'shopping_cart', title: 'Compra', desc: 'Realiza compra, controle de estoque, produção.' },
    { icon: 'inventory_2', title: 'Estoque', desc: 'Inventário de estoque, custo médio do estoque, ajuste de estoque etc.' },
    { icon: 'factory', title: 'Produção', desc: 'Orçamento de produção, ordem de produção, apontamento, etc.' },
    { icon: 'attach_money', title: 'Financeiro', desc: 'Pagamento, recebimento, adiantamento e tesouraria.' },
    { icon: 'storefront', title: 'Comercial', desc: 'Orçamento de venda, pedido de venda, faturamento, etc.' },
    { icon: 'domain', title: 'Controle de patrimônio', desc: 'Baixa de bens, venda de bens, cálculo de depreciação, etc.' },
    { icon: 'receipt_long', title: 'Escrita fiscal', desc: 'Entrada/saída de documentos fiscais, apuração de imposto, emissão de NF-e, CT-e e MDF-e.' },
    { icon: 'account_balance', title: 'Contabilidade', desc: 'Lançamentos, balancetes, sped ECD, etc.' },
    { icon: 'local_shipping', title: 'Manifesto eletrônico', desc: 'Realiza a emissão do manifesto de entrega eletrônico.' },
    { icon: 'description', title: 'Conhecimento de frete', desc: 'Realiza a emissão de conhecimento eletrônica automaticamente através do pedido de venda.' },
    { icon: 'point_of_sale', title: 'Ponto de venda', desc: 'Ponto de venda com emissão de NFC-e.' },
    { icon: 'hub', title: 'Integrador ponto de venda', desc: 'Ponto de venda integra, através do integrador ao SAFE.' },
  ]);

  // 4. FAQ (Dados do SAFE)
  faqs = signal<FaqItem[]>([
    {
      question: 'A quem interessa o software SAFE?',
      answer: 'O SAFE é ideal para gestores que buscam eficiência em varejo, atacado e indústrias, integrando estoque, financeiro e fiscal em uma única plataforma.',
      isOpen: false
    },
    {
      question: 'Em que SAFE pode me ajudar?',
      answer: 'Ele elimina o retrabalho e erros manuais. Ajuda na apuração correta de impostos, controle rigoroso de estoque e fornece relatórios precisos para tomada de decisão.',
      isOpen: false
    },
    {
      question: 'Como é feito a integração do SAFE com o ponto de venda?',
      answer: 'A integração é automática através do nosso módulo integrador. Vendas realizadas no PDV baixam o estoque e alimentam o financeiro do SAFE em tempo real.',
      isOpen: false
    }
  ]);

  // 5. Injeção de dependências para SEO
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  // 6. Configuração inicial (Título da aba e Meta tags)
  ngOnInit(): void {
    this.title.setTitle('Sistema SAFE - Gestão Empresarial | Inforplace');
    this.meta.updateTag({ name: 'description', content: 'Gestão completa para o seu negócio. O SAFE integra estoque, financeiro e fiscal para garantir eficiência e resultados.' });
  }

  // 7. Lógica do FAQ
  toggleFaq(index: number) {
    this.faqs.update(items => {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        isOpen: !updatedItems[index].isOpen
      };
      return updatedItems; // Fecha os outros automaticamente se quiser implementar essa lógica, ou mantém simples assim
    });
  }
}
