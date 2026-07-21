import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthTutorService } from '../../../../core/services/auth-tutor.service'; // <-- INYECCIÓN AJUSTADA CON EL NOMBRE EXACTO DEL SERVICIO
import { RecuperarPasswordRequest } from '../../models/auth.models';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
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

  constructor(
    private authTutorService: AuthTutorService, // <-- SE INTEGRA EL SERVICIO GLOBAL EN EL CONSTRUCTOR
    private router: Router,
  ) {}

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

    // CONSTRUCCIÓN DEL OBJETO CON LA ESTRUCTURA ESPERADA POR LA INTERFAZ RECUPERARPASSWORDREQUEST
    const payload: RecuperarPasswordRequest = {
      correo: this.correoRecuperacion.toLowerCase().trim(),
    };

    console.log(
      'DISPARANDO SOLICITUD DE RECUPERACIÓN HACIA EL SERVICIO SUTURADO CON EL PAYLOAD:',
      payload,
    );

    // LLAMADA DIRECTA AL MÉTODO EXISTENTE EN TU SERVICIO (COMPATIBLE CON MOCK Y CON SERVIDOR REAL)
    this.authTutorService.recuperarContrasena(payload).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.mensajeExito = respuesta.mensaje;
        this.correoEnviado.set(true);
      },
      error: (err) => {
        this.cargando.set(false);
        // CAPTURA EL ERROR QUE DISPARA TU CONTROLADOR INTERNO (EXCELENTE PARA MANEJAR "CORREO NO REGISTRADO")
        this.mensajeErrorGlobal = err.message || 'Ocurrió un error al procesar la solicitud.';
      },
    });
  }

  // SE ELIMINÓ LA FUNCIÓN irALogin() PORQUE YA SE GESTIONA CON ROUTERLINK DIRECTAMENTE EN EL ARCHIVO HTML
}
