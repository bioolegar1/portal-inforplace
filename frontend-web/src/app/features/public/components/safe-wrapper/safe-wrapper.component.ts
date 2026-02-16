import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {Component} from '@angular/core';

@Component({
  selector: 'app-safe-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-[80vh] bg-white">
      <iframe
        [src]="safeUrl"
        class="w-full h-full border-none"
        title="Sistema Safe - Gerar Boleto">
      </iframe>
    </div>
  `
})
export class SafeWrapperComponent {
  safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Logica: O Angular bloqueia iframes externos por seguranca.
    // Precisamos marcar a URL como confiavel [cite: 2025-12-08].
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://inforplace.com.br/safe'); //https://inforplace.com.br/safe
  }
}
