import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {ReleaseService} from '../../../../core/services/release.service';
import {ReleaseNoteListItem} from '../../../../core/models/release-note.model';


@Component({
  selector: 'app-release-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink é essencial para o botão funcionar
  templateUrl: './release-list.component.html'
})
export class ReleaseListComponent implements OnInit {
  private releaseService = inject(ReleaseService);

  releases = signal<ReleaseNoteListItem[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadReleases();
  }

  loadReleases() {
    this.isLoading.set(true);
    // Chama o endpoint de ADMIN (lista tudo, incluindo rascunhos)
    this.releaseService.getAllReleases(undefined, 0, 100).subscribe({
      next: (page) => {
        this.releases.set(page.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar releases:', err);
        this.isLoading.set(false);
      }
    });
  }

  deleteRelease(id: number) {
    if (confirm('Tem certeza que deseja excluir esta release?')) {
      this.releaseService.deleteRelease(id).subscribe({
        next: () => {
          // Remove da lista localmente para não precisar recarregar tudo
          this.releases.update(list => list.filter(r => r.id !== id));
        },
        error: (err) => console.error('Erro ao excluir:', err)
      });
    }
  }
}
