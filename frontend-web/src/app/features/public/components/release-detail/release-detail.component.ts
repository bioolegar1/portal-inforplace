import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReleaseService } from '../../../../core/services/release.service';
import { ReleaseNote } from '../../../../core/models/release-note.model';
import {BlockRendererComponent} from '../../../../ui/blocks/block-renderer/block-renderer.component';
// 👇 Importação do seu Renderizador de Blocos

@Component({
  selector: 'app-release-detail',
  standalone: true,
  // 👇 Adicione o BlockRendererComponent aqui nos imports
  imports: [CommonModule, BlockRendererComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">

      @if (loading()) {
        <div class="container mx-auto px-4 py-8 animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 w-32 mb-6 rounded"></div>
          <div class="h-64 bg-gray-200 dark:bg-gray-700 w-full rounded-lg mb-8"></div>
          <div class="h-10 bg-gray-200 dark:bg-gray-700 w-3/4 mb-4 rounded"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 w-full rounded"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 w-full rounded"></div>
          </div>
        </div>
      }

      @else if (error()) {
        <div class="container mx-auto px-4 py-16 text-center">
          <div class="bg-red-50 border border-red-200 rounded-lg p-8 inline-block max-w-md">
            <h2 class="text-xl font-bold text-red-800 mb-2">Erro ao carregar nota</h2>
            <p class="text-red-600 mb-4">{{ error() }}</p>
            <button
              (click)="goBack()"
              class="px-4 py-2 bg-white text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
            >
              Voltar para a lista
            </button>
          </div>
        </div>
      }

      @else {
        @if (release(); as item) {

          <div class="relative w-full h-64 md:h-80 lg:h-96 bg-gray-800">
            @if (item.coverImage) {
              <img
                [src]="item.coverImage"
                [alt]="item.title"
                class="w-full h-full object-cover opacity-60"
              />
            } @else {
              <div class="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <span class="text-white text-opacity-10 text-8xl font-bold tracking-tighter">IP</span>
              </div>
            }

            <button
              (click)="goBack()"
              class="absolute top-6 left-4 md:left-8 bg-white/90 dark:bg-gray-800/90 hover:bg-white text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 font-medium z-20"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Voltar
            </button>

            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
          </div>

          <article class="container mx-auto px-4 -mt-32 relative z-10 pb-20">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-12 border border-gray-100 dark:border-gray-700">

              <header class="mb-10 border-b border-gray-100 dark:border-gray-700 pb-8">
                <div class="flex flex-wrap items-center gap-4 mb-6">
                  <span class="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full text-xs uppercase tracking-wide">
                    {{ item.category || 'Geral' }}
                  </span>

                  @if (item.version) {
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-xs rounded-full">
                      v{{ item.version }}
                    </span>
                  }

                  <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm ml-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    {{ formatDate(item.publishedAt || item.createdAt) }}
                  </div>
                </div>

                <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {{ item.title }}
                </h1>

                @if (item.summary) {
                  <p class="mt-4 text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                    {{ item.summary }}
                  </p>
                }
              </header>

              @if (item.blocks && item.blocks.length > 0) {
                <app-block-renderer [blocks]="item.blocks"></app-block-renderer>
              } @else {
                <div class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  <div [innerHTML]="item.content"></div>
                </div>
              }

            </div>
          </article>
        }
      }
    </div>
  `
})
export class ReleaseDetailComponent implements OnInit {
  release = signal<ReleaseNote | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private releaseService = inject(ReleaseService);

  ngOnInit(): void {
    this.fetchRelease();
  }

  fetchRelease(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.error.set('Identificador da nota não encontrado.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    this.releaseService.getReleaseBySlug(slug).subscribe({
      next: (data) => {
        // Garantir que blocks seja um array, mesmo que venha null do back
        const safeData = {
          ...data,
          blocks: data.blocks || []
        };
        this.release.set(safeData);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Não foi possível carregar os detalhes desta atualização.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
