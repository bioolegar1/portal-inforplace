import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockType, ContentBlock, AlertType, ComparisonBlock } from '../../../core/models/blocks/content-block.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-block-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './block-manager.component.html',
  styleUrls: ['./block-manager.component.css']
})
export class BlockManagerComponent {
  @Input() set blocks(value: ContentBlock[]) {
    this._blocks.set(value);
  }

  private readonly UPLOAD_API_URL = 'https://localhost:8080/api/uploads';
  private http = inject(HttpClient);

  @Output() blocksChange = new EventEmitter<ContentBlock[]>();

  _blocks = signal<ContentBlock[]>([]);

  BlockType = BlockType;
  AlertType = AlertType;

  // Lógica: Expandimos a lista para incluir COMPARISON e TIMELINE que estão na sua pasta de blocos
  availableBlocks = [
    { type: BlockType.HEADER, label: 'Título', icon: '📝', description: 'Adicione um cabeçalho' },
    { type: BlockType.TEXT, label: 'Texto', icon: '📄', description: 'Escreva um parágrafo' },
    { type: BlockType.IMAGE, label: 'Imagem', icon: '🖼️', description: 'Insira uma foto' },
    { type: BlockType.ALERT, label: 'Aviso', icon: '💡', description: 'Destaque importante' },
    { type: BlockType.CHECKLIST, label: 'Tarefas', icon: '✓', description: 'Lista de verificação' },
    { type: BlockType.MODULE_HIGHLIGHT, label: 'Destaque', icon: '⭐', description: 'Card especial' },
    { type: BlockType.COMPARISON, label: 'Comparação', icon: '↔️', description: 'Antes e Depois' },
    { type: BlockType.TIMELINE, label: 'Linha do Tempo', icon: '🕒', description: 'Eventos em sequência' }
  ];

  showAddMenu = false;

  addBlock(type: BlockType) {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: type,
      order: this._blocks().length,
      data: this.getInitialDataForType(type)
    };

    this.updateList([...this._blocks(), newBlock]);
    this.showAddMenu = false;
  }

  removeBlock(index: number) {
    const newList = this._blocks().filter((_, i) => i !== index);
    this.updateList(newList);
  }

  moveBlock(index: number, direction: 'up' | 'down') {
    const list = [...this._blocks()];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < list.length) {
      [list[index], list[newIndex]] = [list[newIndex], list[index]];
      list.forEach((block, i) => block.order = i);
      this.updateList(list);
    }
  }

  duplicateBlock(index: number) {
    const blocks = [...this._blocks()];
    const blockToDuplicate = blocks[index];
    const duplicatedBlock: ContentBlock = {
      ...blockToDuplicate,
      id: crypto.randomUUID(),
      order: index + 1,
      data: JSON.parse(JSON.stringify(blockToDuplicate.data))
    };

    blocks.splice(index + 1, 0, duplicatedBlock);
    blocks.forEach((block, i) => block.order = i);
    this.updateList(blocks);
  }

  private updateList(newList: ContentBlock[]) {
    this._blocks.set(newList);
    this.blocksChange.emit(newList);
  }

  private getInitialDataForType(type: BlockType): any {
    switch (type) {
      case BlockType.HEADER:
        return { title: '', level: 2 };
      case BlockType.TEXT:
        return { content: '' };
      case BlockType.ALERT:
        return { type: AlertType.INFO, title: '', message: '' };
      case BlockType.CHECKLIST:
        return { title: 'Lista de Verificação', items: [] };
      case BlockType.IMAGE:
        return { url: '', caption: '' };
      case BlockType.MODULE_HIGHLIGHT:
        return { title: '', subtitle: '', iconUrl: '', variant: 'primary', features: [] };
      case BlockType.COMPARISON:
        return { imageBefore: '', imageAfter: '', captionBefore: '', captionAfter: '', sliderPosition: 50 };
      // Lógica: Adicionada inicialização para o bloco de TIMELINE
      case BlockType.TIMELINE:
        return { title: 'Marcos do Projeto', items: [{ title: '', date: '', description: '' }] };
      default:
        return {};
    }
  }

  addFeature(blockIndex: number) {
    const blocks = [...this._blocks()];
    if (!blocks[blockIndex].data.features) {
      blocks[blockIndex].data.features = [];
    }
    blocks[blockIndex].data.features.push('');
    this.updateList(blocks);
  }

  removeFeature(blockIndex: number, featureIndex: number) {
    const blocks = [...this._blocks()];
    blocks[blockIndex].data.features.splice(featureIndex, 1);
    this.updateList(blocks);
  }

  trackByFn(index: number): number {
    return index;
  }

  addChecklistItem(blockIndex: number) {
    const blocks = [...this._blocks()];
    const block = blocks[blockIndex];
    if (!block.data.items) block.data.items = [];

    block.data.items.push({ text: '', checked: false });
    this.updateList(blocks);
  }

  removeChecklistItem(blockIndex: number, itemIndex: number) {
    const blocks = [...this._blocks()];
    blocks[blockIndex].data.items.splice(itemIndex, 1);
    this.updateList(blocks);
  }

  getBlockTypeName(type: BlockType): string {
    const blockInfo = this.availableBlocks.find(b => b.type === type);
    return blockInfo ? blockInfo.label : type;
  }

  getBlockTypeIcon(type: BlockType): string {
    const blockInfo = this.availableBlocks.find(b => b.type === type);
    return blockInfo ? blockInfo.icon : '📦';
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3EErro ao carregar imagem%3C/text%3E%3C/svg%3E';
  }

  onUploadImage(event: Event, block: ContentBlock, field: 'imageBefore' | 'imageAfter'): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ url: string }>(this.UPLOAD_API_URL, formData).subscribe({
        next: (response) => {
          if (block.type === BlockType.COMPARISON) {
            (block as ComparisonBlock).data[field] = response.url;
            console.log(`Sucesso! Imagem salva em: ${field}`, response.url);
          }
        },
        error: (err) => {
          console.error('Erro ao fazer upload da imagem:', err);
          alert('Erro ao enviar a imagem. Verifique se o backend está rodando.');
        },
        complete: () => {
          input.value = '';
        }
      });
    }
  }
}
