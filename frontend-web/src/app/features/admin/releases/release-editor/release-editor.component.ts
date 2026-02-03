import { Component, inject, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ContentBlock, BlockType, AlertType, ChecklistItem, TimelineStep
} from '../../../../core/models/blocks/content-block.interface';
import { ReleaseService } from '../../../../core/services/release.service';

@Component({
  selector: 'app-release-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './release-editor.component.html',
  styleUrls: ['./release-editor.component.css']
})
export class ReleaseEditorComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private releaseService = inject(ReleaseService);
  private platformId = inject(PLATFORM_ID);

  form: FormGroup;
  isEditMode = signal(false);
  isSaving = signal(false);
  blocks = signal<ContentBlock[]>([]);

  BlockType = BlockType;
  AlertType = AlertType;

  // ✅ CORREÇÃO AQUI: Adicionado o COMPARISON na lista
  blockOptions = [
    { type: BlockType.HEADER, label: 'Cabeçalho', icon: 'H', desc: 'Título de seção' },
    { type: BlockType.TEXT, label: 'Texto', icon: '¶', desc: 'Parágrafo rico' },
    { type: BlockType.IMAGE, label: 'Imagem', icon: '🖼️', desc: 'Foto ou print' },
    { type: BlockType.ALERT, label: 'Alerta', icon: '💡', desc: 'Aviso importante' },
    { type: BlockType.CHECKLIST, label: 'Checklist', icon: '✓', desc: 'Lista de tarefas' },
    { type: BlockType.COMPARISON, label: 'Comparação', icon: '↔️', desc: 'Antes e Depois' }, // <--- AGORA VAI APARECER
    { type: BlockType.MODULE_HIGHLIGHT, label: 'Módulo', icon: '⭐', desc: 'Showcase de feature' },
    { type: BlockType.TIMELINE, label: 'Timeline', icon: '📅', desc: 'Passo a passo' },
  ];

  categories = ['Pillar', 'Safe', 'Mobile', 'Institucional', 'Fiscal'];

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      version: ['', [Validators.pattern(/^\d+\.\d+\.\d+$/)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      category: ['Pillar', Validators.required],
      status: ['draft', Validators.required],
      summary: ['', [Validators.maxLength(500)]],
      coverImage: ['', [Validators.pattern(/^https?:\/\/.+/)]]
    });

    const slug = this.route.snapshot.paramMap.get('id');
    if (slug) {
      this.isEditMode.set(true);
      this.loadRelease(slug);
    } else {
      this.addBlock(BlockType.HEADER);
      this.addBlock(BlockType.TEXT);
    }

    if (isPlatformBrowser(this.platformId)) {
      this.setupUnsavedChangesWarning();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.onbeforeunload = null;
    }
  }

  private setupUnsavedChangesWarning() {
    this.form.valueChanges.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.onbeforeunload = () => this.form.dirty ? true : null;
      }
    });
  }

  // --- GERENCIAMENTO DE BLOCOS ---

  addBlock(type: BlockType) {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: type,
      order: this.blocks().length,
      data: this.getInitialDataForType(type)
    };
    this.blocks.update(current => [...current, newBlock]);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const element = document.getElementById(`block-${newBlock.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const input = element.querySelector('input, textarea') as HTMLElement;
          if (input) input.focus();
        }
      }, 100);
    }
  }

  removeBlock(index: number) {
    if (isPlatformBrowser(this.platformId)) {
      if (confirm('Tem certeza que deseja remover este bloco?')) {
        this.blocks.update(current => current.filter((_, i) => i !== index));
      }
    } else {
      this.blocks.update(current => current.filter((_, i) => i !== index));
    }
  }

  moveBlock(index: number, direction: 'up' | 'down') {
    this.blocks.update(current => {
      const newBlocks = [...current];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newBlocks.length) {
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      }
      return newBlocks;
    });
  }

  // --- HELPERS ---

  getBlockIcon(type: BlockType): string {
    const option = this.blockOptions.find(o => o.type === type);
    return option ? option.icon : '📦';
  }

  getChecklistItems(blockData: any): ChecklistItem[] {
    return Array.isArray(blockData?.items) ? blockData.items : [];
  }

  getFeatures(blockData: any): string[] {
    return Array.isArray(blockData?.features) ? blockData.features : [];
  }

  getSteps(blockData: any): TimelineStep[] {
    return Array.isArray(blockData?.steps) ? blockData.steps : [];
  }

  // --- LOGICA DE ITENS INTERNOS ---

  addChecklistItem(blockIndex: number) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      if (!blocks[blockIndex].data.items) blocks[blockIndex].data.items = [];
      blocks[blockIndex].data.items.push({ text: '', checked: false });
      return blocks;
    });
  }

  removeChecklistItem(blockIndex: number, itemIndex: number) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      blocks[blockIndex].data.items.splice(itemIndex, 1);
      return blocks;
    });
  }

  addTimelineStep(blockIndex: number) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      if (!blocks[blockIndex].data.steps) blocks[blockIndex].data.steps = [];
      blocks[blockIndex].data.steps.push({ title: '', description: '', status: 'pending' });
      return blocks;
    });
  }

  removeTimelineStep(blockIndex: number, stepIndex: number) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      blocks[blockIndex].data.steps.splice(stepIndex, 1);
      return blocks;
    });
  }

  addFeature(blockIndex: number) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      if (!blocks[blockIndex].data.features) blocks[blockIndex].data.features = [];
      blocks[blockIndex].data.features.push('');
      return blocks;
    });
  }

  updateFeature(blockIndex: number, featureIndex: number, value: string) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      blocks[blockIndex].data.features[featureIndex] = value;
      return blocks;
    });
  }

  removeFeature(blockIndex: number, featureIndex: number) {
    this.blocks.update(current => {
      const blocks = this.deepClone(current);
      blocks[blockIndex].data.features.splice(featureIndex, 1);
      return blocks;
    });
  }

  // --- DADOS INICIAIS ---
  private getInitialDataForType(type: BlockType): any {
    switch (type) {
      case BlockType.HEADER: return { title: '', level: 2 };
      case BlockType.TEXT: return { content: '', allowHtml: false };
      case BlockType.IMAGE: return { url: '', alt: '', width: 'full' };
      case BlockType.ALERT: return { type: AlertType.INFO, message: '', title: '' };
      case BlockType.CHECKLIST: return { title: '', items: [{ text: '', checked: false }] };

      // ✅ CORREÇÃO AQUI: Dados iniciais do Comparison
      case BlockType.COMPARISON: return {
        imageBefore: '',
        imageAfter: '',
        captionBefore: '',
        captionAfter: '',
        sliderPosition: 50
      };

      case BlockType.MODULE_HIGHLIGHT: return { title: '', subtitle: '', features: [''], variant: 'primary', iconUrl: '⭐' };
      case BlockType.TIMELINE: return { title: '', steps: [{ title: '', description: '', status: 'pending' }] };
      default: return {};
    }
  }

  // --- CARREGAR E SALVAR ---
  loadRelease(slug: string) {
    this.releaseService.getReleaseBySlug(slug).subscribe({
      next: (data: any) => {
        this.form.patchValue({
          title: data.title,
          version: data.version,
          category: data.category,
          summary: data.summary,
          status: data.status,
          date: data.date,
          coverImage: data.coverImage
        });
        if (data.blocks && Array.isArray(data.blocks)) {
          this.blocks.set(data.blocks);
        }
      },
      error: (error) => {
        console.error(error);
        if (isPlatformBrowser(this.platformId)) {
          alert('Erro ao carregar release.');
        }
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (isPlatformBrowser(this.platformId)) {
        alert('Verifique os campos obrigatórios.');
      }
      return;
    }

    this.isSaving.set(true);
    const payload = {
      ...this.form.value,
      blocks: this.blocks(),
      updatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      console.log('Saved:', payload);
      this.isSaving.set(false);
      this.form.markAsPristine();

      if (isPlatformBrowser(this.platformId)) {
        window.onbeforeunload = null;
      }
      this.router.navigate(['/admin/releases']);
    }, 1000);
  }

  goBack() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.form.dirty && !confirm('Sair sem salvar?')) return;
      window.onbeforeunload = null;
    }
    this.location.back();
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
