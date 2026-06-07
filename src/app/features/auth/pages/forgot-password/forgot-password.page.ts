import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage {
  cargando = signal<boolean>(false);
  correoEnviado = signal<boolean>(false);
  mensajeExito: string | null = null;
  mensajeErrorGlobal: string | null = null;

  correoRecuperacion: string = '';
  errorCorreo: string | null = null;

  constructor(private router: Router) {}

  limpiarError(): void {
    this.errorCorreo = null;
    this.mensajeErrorGlobal = null;
  }

  procesarRecuperacion(): void {
    this.errorCorreo = null;
    this.mensajeErrorGlobal = null;
    this.mensajeExito = null;

    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronCorreo.test(this.correoRecuperacion)) {
      this.errorCorreo = 'El formato del correo electrónico no es válido.';
      return;
    }

    this.cargando.set(true);

    console.log('Solicitando recuperación para:', this.correoRecuperacion);

    // Simulación de petición de recuperación (Se puede conectar a tu servicio real después)
    setTimeout(() => {
      this.cargando.set(false);

      if (this.correoRecuperacion.toLowerCase().trim() === 'tutor@gmail.com') {
        this.mensajeExito = `Se ha enviado un enlace de restauración a ${this.correoRecuperacion}. Por favor, revisa tu bandeja de entrada.`;
        this.correoEnviado.set(true);
      } else {
        this.mensajeErrorGlobal = 'El correo ingresado no coincide con ninguna cuenta registrada.';
      }
    }, 1500);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}
