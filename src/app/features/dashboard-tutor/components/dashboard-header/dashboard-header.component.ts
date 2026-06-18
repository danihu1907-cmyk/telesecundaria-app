import { Component, input, output, signal } from '@angular/core';
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
  nombreTutor = input<string>('');
  nombreUsuario = input<string>('');
  inicialesUsuario = input<string>('');
  cerrarSesion = output<void>();
  dropdownAbierto = signal(false);

  toggleDropdown() {
    this.dropdownAbierto.update((v) => !v);
  }
  onCerrarSesion() {
    this.dropdownAbierto.set(false);
    this.cerrarSesion.emit();
  }
}
