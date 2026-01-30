import { Component, input, signal, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero-solution',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './hero-solution.component.html'
})
export class HeroSolutionComponent {
  tag = input.required<string>();
  titlePrincipal = input.required<string>();
  titleDestaque = input.required<string>();
  description = input.required<string>();
  imagePaths = input.required<string[]>();
  color = input<string>('orange');

  // Adicione este output
  contactClick = output<void>();

  currentIndex = signal<number>(1);
  isHovering = signal<boolean>(false);

  onMouseMove(event: MouseEvent): void {
    this.isHovering.set(true);
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    if (width === 0) return;

    const position = x / width;
    const zone = Math.floor(position * 3);
    this.currentIndex.set(zone);
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
    this.currentIndex.set(1);
  }

  getZIndex(index: number): number {
    return index === this.currentIndex() ? 30 : 10;
  }

  getOpacity(index: number): number {
    return index === this.currentIndex() ? 1 : 0.5;
  }

  getTransform(index: number): string {
    const current = this.currentIndex();
    const hovering = this.isHovering();

    if (index === current) {
      const scale = hovering ? 1.54 : 1.10;
      return `scale(${scale}) translateX(0)`;
    }

    const baseOffset = hovering ? 200 : 140;
    const scale = 0.85;

    if (index < current) {
      const offset = (current - index) * baseOffset;
      return `scale(${scale}) translateX(-${offset}px)`;
    }

    if (index > current) {
      const offset = (index - current) * baseOffset;
      return `scale(${scale}) translateX(${offset}px)`;
    }

    return 'scale(1) translateX(0)';
  }

  // Simplifique este método
  onContactClick(event: Event): void {
    event.preventDefault();
    this.contactClick.emit();
  }

  get colorClasses() {
    const c = this.color();

    const colorMap: { [key: string]: { from: string, to: string, button: string, accent: string } } = {
      orange: { from: '#7c2d12', to: '#111827', button: '#ea580c', accent: '#fb923c' },
      blue: { from: '#1e3a8a', to: '#111827', button: '#1e40af', accent: '#60a5fa' },
      sky: { from: '#0c4a6e', to: '#111827', button: '#0284c7', accent: '#38bdf8' },
      teal: { from: '#134e4a', to: '#111827', button: '#0d9488', accent: '#2dd4bf' },
      verde: { from: '#064e3b', to: '#111827', button: '#15803d', accent: '#4ade80' },
      preto: { from: '#1f2937', to: '#030712', button: '#374151', accent: '#94a3b8' }
    };

    const selected = colorMap[c] || colorMap['orange'];

    return {
      tagBg: `bg-${c}-500/10`,
      tagText: `text-${c}-400`,
      tagBorder: `border-${c}-500/30`,
      accentBorder: `border-${c}-500`,
      heroStyle: {
        'background': `linear-gradient(to bottom right, ${selected.from}, ${selected.to})`
      },
      buttonStyle: {
        'background-color': selected.button
      },
      accentText: {
        'color': selected.accent
      }
    };
  }
}
