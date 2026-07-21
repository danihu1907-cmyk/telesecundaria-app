import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursos',
  imports: [],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos {
  // Estado para el Modal de Próximamente
  mostrarAvisoProximamente = signal<boolean>(false);

  abrirModal(): void {
    this.mostrarAvisoProximamente.set(true);
  }

  cerrarModal(): void {
    this.mostrarAvisoProximamente.set(false);
  }
}
