import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonBlock } from '../../../core/models/blocks/content-block.interface';

@Component({
  selector: 'app-comparison-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comparison-block">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Antes -->
        <div class="space-y-2">
          <div class="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-t-lg inline-block">
            ❌ Antes
          </div>
          <img
            [src]="data.imageBefore"
            alt="Antes"
            class="w-full h-auto rounded-lg shadow-lg"
            loading="lazy"
          />
          @if (data.captionBefore) {
            <p class="text-sm text-gray-600 dark:text-gray-400 italic">
              {{ data.captionBefore }}
            </p>
          }
        </div>

        <!-- Depois -->
        <div class="space-y-2">
          <div class="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-t-lg inline-block">
            ✅ Depois
          </div>
          <img
            [src]="data.imageAfter"
            alt="Depois"
            class="w-full h-auto rounded-lg shadow-lg"
            loading="lazy"
          />
          @if (data.captionAfter) {
            <p class="text-sm text-gray-600 dark:text-gray-400 italic">
              {{ data.captionAfter }}
            </p>
          }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ComparisonBlockComponent {
  @Input() data!: ComparisonBlock['data'];
}
