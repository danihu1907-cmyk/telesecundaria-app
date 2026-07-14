import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
})
export class DashboardHeaderComponent {
  // CONFIGURACIÓN DE ENTRADAS USANDO SIGNAL INPUTS
  nombreTutor = input<string>('');
  inicialesUsuario = input<string>('');
  cerrarSesion = output<void>();
  dropdownAbierto = signal(false);

  // COMPUTED PARA DETECTAR EL PRIMER NOMBRE DEL TUTOR AUTOMÁTICAMENTE
  nombreCorto = computed(() => {
    const nombre = this.nombreTutor().trim();
    return nombre ? nombre.split(' ')[0] : '';
  });

  toggleDropdown() {
    this.dropdownAbierto.update((v) => !v);
  }

  onCerrarSesion() {
    this.dropdownAbierto.set(false);
    this.cerrarSesion.emit();
  }
}
