import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})

export class StatCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = '';
  @Input() icon = '';

  isPositiveChange(): boolean {
    return this.change?.includes('+');
  }

  getIconClass(name: string): string {
    switch (name) {
      case 'project':
        return 'fas fa-layer-group';
      case 'design':
        return 'fas fa-pencil-ruler';
      case 'download':
        return 'fas fa-download';
      case 'active':
        return 'fas fa-bolt';
      default:
        return 'fas fa-chart-bar';
    }
  }
}
