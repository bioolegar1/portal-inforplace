import { Component, OnInit, signal, ViewChild, inject } from '@angular/core'; // <--- Adicionado 'inject'
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // <--- Adicionado 'HttpClient'

import { BlockManagerComponent } from '../../../../ui/blocks/block-manager/block-manager.component';
import { BlockType, ContentBlock } from '../../../../core/models/blocks/content-block.interface';
import { ReleaseService } from '../../../../core/services/release.service';

@Component({
  selector: 'app-release-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BlockManagerComponent],
  templateUrl: './release-editor.component.html'
})
export class ReleaseEditorComponent implements OnInit {
  @ViewChild(BlockManagerComponent) blockManager!: BlockManagerComponent;

  // Injeção do HttpClient para upload direto
  private http = inject(HttpClient);
  private readonly UPLOAD_API_URL = 'https://localhost:8080/api/uploads';

  form: FormGroup;
  blocks = signal<ContentBlock[]>([]);
  isLoading = signal(false);
  isEditing = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private releaseService: ReleaseService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      version: ['', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(500)]],
      coverImage: [''],
      isPublished: [false]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadRelease(Number(id));
    }
  }

  generateSlug() {
    const title = this.form.get('title')?.value;
    if (title) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      this.form.patchValue({ slug });
    }
  }

  updateBlocks(newBlocks: ContentBlock[]) {
    this.blocks.set(newBlocks);
  }

  addBlockFromSidebar(blockType: string) {
    const type = BlockType[blockType as keyof typeof BlockType];

    if (type && this.blockManager) {
      this.blockManager.addBlock(type);

      setTimeout(() => {
        const blocks = document.querySelectorAll('.block-card');
        if (blocks.length > 0) {
          const lastBlock = blocks[blocks.length - 1];
          lastBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  loadRelease(id: number) {
    this.isLoading.set(true);
    this.releaseService.getReleaseById(id).subscribe({
      next: (release: any) => { // Tipagem genérica 'any' ou a interface Release se tiver
        this.form.patchValue(release);
        this.blocks.set(release.contentBlocks || []); // Ajustado para contentBlocks conforme backend
        this.isLoading.set(false);
      },
      error: (err: any) => { // <--- Tipagem 'any' adicionada aqui
        console.error('Erro ao carregar release:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);

    const releaseData = {
      ...this.form.value,
      contentBlocks: this.blocks(),
      publishedAt: this.form.value.isPublished ? new Date().toISOString() : null
    };

    const id = this.route.snapshot.paramMap.get('id');

    if (this.isEditing() && id) {
      this.releaseService.updateRelease(Number(id), releaseData).subscribe({
        next: () => this.handleNavigateBack(),
        error: (err: any) => this.handleError(err) // <--- Tipagem 'any'
      });
    } else {
      this.releaseService.createRelease(releaseData).subscribe({
        next: () => this.handleNavigateBack(),
        error: (err: any) => this.handleError(err) // <--- Tipagem 'any'
      });
    }
  }

  private handleNavigateBack() {
    this.isLoading.set(false);
    // Adicionado .then() para resolver o aviso de "Promise ignored"
    this.router.navigate(['/admin/releases']).then();
  }

  private handleError(err: any) { // <--- Tipagem 'any'
    this.isLoading.set(false);
    console.error('Erro na operação:', err);
    alert('Erro ao salvar os dados no servidor.');
  }

  // --- MÉTODO DE UPLOAD CORRIGIDO ---
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.isLoading.set(true);

      this.http.post<{ url: string }>(this.UPLOAD_API_URL, formData).subscribe({
        next: (response: { url: string }) => { // <--- Tipagem explícita na resposta
          this.form.patchValue({
            coverImage: response.url
          });
          this.isLoading.set(false);
        },
        error: (err: any) => { // <--- Tipagem 'any' no erro
          console.error('Erro no upload da capa:', err);
          alert('Erro ao enviar a imagem. Verifique se o backend está rodando.');
          this.isLoading.set(false);
        }
      });
    }
  }

  removeImage() {
    this.form.patchValue({
      coverImage: null
    });
  }
}
