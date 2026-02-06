import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReleaseService } from '../../../core/services/release.service';
import { ReleaseNoteListItem } from '../../../core/models/release-note.model';

@Component({
  selector: 'app-release-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './release-hub.component.html',
})
export class ReleaseHubComponent implements OnInit { // ✅ Classe exportada corretamente
  private releaseService = inject(ReleaseService);

  // Agora usamos o tipo correto do backend (ReleaseNoteListItem)
  releases = signal<ReleaseNoteListItem[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadReleases();
  }

  loadReleases() {
    this.isLoading.set(true);

    // O método getPublishedReleases agora aceita paginação.
    // Pedimos a página 0 com 50 itens para garantir que carregue bastante coisa na home.
    this.releaseService.getPublishedReleases(0, 50).subscribe({
      next: (page) => {
        this.releases.set(page.content); // O backend retorna um objeto Page, pegamos o content
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar releases públicas:', err);
        this.isLoading.set(false);
      }
    });
  }
}
