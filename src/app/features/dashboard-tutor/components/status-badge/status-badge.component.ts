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

  private get estatusLimpio(): string {
    return this.estatus().trim().toLowerCase();
  }
  // TEXTO VISUAL
  get label(): string {
    switch (this.estatusLimpio) {
      case 'oculto':
        return '';
      case 'documentos incompletos':
        return 'Documentos Incompletos';
      case 'aceptado':
        return 'Aceptado';
      case 'rechazado':
        return 'Rechazado';
      case 'en proceso':
        return 'En Proceso';
      default:
        return this.estatus(); // Si no coincide, devuelve el original
    }
  }

  // CLASE CSS PARA COLOR
  get claseCss(): string {
    switch (this.estatusLimpio) {
      case 'documentos incompletos':
      case 'en proceso':
        return 'status-proceso'; // AMARILLO (Agrupado limpiamente)
      case 'aceptado':
        return 'status-exito'; // VERDE
      case 'rechazado':
        return 'status-error'; // ROJO
      default:
        return ''; // Sin clase si está oculto o desconocido
    }
  }
}
