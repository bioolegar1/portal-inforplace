import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReleaseService } from '../../../../core/services/release.service';
import { ReleaseNote } from '../../../../core/models/release-note.model';

@Component({
  selector: 'app-release-detail',
  standalone: true,
  imports: [CommonModule],
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
                class="w-full h-full object-cover opacity-80"
              />
            } @else {
              <div class="w-full h-full bg-gradient-to-r from-primary-700 to-primary-900 flex items-center justify-center">
                <span class="text-white text-opacity-20 text-6xl font-bold">Inforplace</span>
              </div>
            }

            <button
              (click)="goBack()"
              class="absolute top-6 left-4 md:left-8 bg-white/90 dark:bg-gray-800/90 hover:bg-white text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 font-medium"
            >
              <span>&larr;</span> Voltar
            </button>
          </div>

          <article class="container mx-auto px-4 -mt-16 relative z-10">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden p-6 md:p-10">

              <div class="flex flex-wrap items-center gap-4 mb-6">
                <span class="px-3 py-1 bg-primary-100 text-primary-800 font-bold rounded-full text-sm">
                  {{ item.version }}
                </span>
                <span class="text-gray-500 dark:text-gray-400 text-sm">
                  {{ formatDate(item.publishedAt || item.createdAt) }}
                </span>
                <span class="text-gray-500 dark:text-gray-400 text-sm ml-auto">
                  {{ item.viewCount }} visualizações
                </span>
              </div>

              <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b dark:border-gray-700 pb-4">
                {{ item.title }}
              </h1>

              <div class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <div [innerHTML]="item.content"></div>
              </div>
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

    // Simulação da chamada de serviço
    this.releaseService.getReleaseBySlug(slug).subscribe({
      next: (data) => {
        this.release.set(data);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
