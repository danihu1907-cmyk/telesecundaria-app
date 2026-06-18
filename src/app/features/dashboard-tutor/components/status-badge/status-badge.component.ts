import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  estatus = input.required<string>();

  get label(): string {
    const s = this.estatus().toLowerCase();
    if (s.includes('incompleto')) return 'Documentos incompletos';
    if (s.includes('completo')) return 'Completo';
    if (s.includes('revision') || s.includes('revisión')) return 'En revisión';
    if (s.includes('enviado')) return 'Enviado';
    return this.estatus();
  }
}
