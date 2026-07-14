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

  // TEXTO VISUAL
  get label(): string {
    const s = this.estatus().trim();
    if (s === 'Oculto') return '';
    if (s === 'Documentos incompletos') return 'Documentos Incompletos';
    if (s === 'Aceptado') return 'Aceptado';
    if (s === 'Rechazado') return 'Rechazado';
    // NUEVA CONDICIÓN PARA EL TEXTO
    if (s === 'En proceso' || s === 'EN PROCESO') return 'En Proceso';
    return s;
  }

  // CLASE CSS PARA COLOR
  get claseCss(): string {
    const s = this.estatus().trim();
    if (s === 'Documentos incompletos') return 'status-proceso'; // AMARILLO
    if (s === 'Aceptado') return 'status-exito'; // VERDE
    if (s === 'Rechazado') return 'status-error'; // ROJO

    // NUEVA CONDICIÓN MAESTRA: APUNTA A LA MISMA CLASE AMARILLA (.status-proceso)
    if (s === 'En proceso' || s === 'EN PROCESO') return 'status-proceso'; // AMARILLO

    return ''; // SIN CLASE SI ESTÁ OCULTO
  }
}
