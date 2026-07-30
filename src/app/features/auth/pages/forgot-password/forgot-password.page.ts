import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthTutorService } from '../../../../core/services/auth-tutor.service'; // <-- INYECCIÓN AJUSTADA CON EL NOMBRE EXACTO DEL SERVICIO
import {
  SolicitarCodigoRequest,
  ValidarCodigoRequest,
  ConfirmarCambioRequest,
} from '../../models/auth.models';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage {
  //CONTROLA EN QUE PASO DEL FLUJO ESTAMOS (1: CORREO, 2: CODIGO, 3: NUEVA CONTRASENA)
  pasoActual = signal<number>(1);
  // SE GUARDA EL CORREO Y EL TOKEN ENTRE PASOS, YA QUE EL BACKEND LOS PIDE EN CADA UNO
  correoGuardado = signal<string>('');
  tokenConfirmacion = signal<string>('');
  cargando = signal<boolean>(false);
  //correoEnviado = signal<boolean>(false);
  mensajeExito: string | null = null;
  mensajeErrorGlobal: string | null = null;

  correoRecuperacion: string = '';
  errorCorreo: string | null = null;
  //CAMPOS PARA EL CODIGO Y NUEVA CONTRASNA
  codigoIngresado: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

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

    const correoLimpio = this.correoRecuperacion.toLowerCase().trim();
    const payload: SolicitarCodigoRequest = { correo: correoLimpio };

    this.authTutorService.solicitarCodigo(payload).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.mensajeExito = respuesta.mensaje;
        this.correoGuardado.set(correoLimpio);
        this.pasoActual.set(2);
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeErrorGlobal =
          err.error?.mensaje || err.message || 'Ocurrió un error al procesar la solicitud.';
      },
    });
    // LLAMADA DIRECTA AL MÉTODO EXISTENTE EN TU SERVICIO (COMPATIBLE CON MOCK Y CON SERVIDOR REAL)
  }
  procesarValidacionCodigo(): void {
    this.mensajeErrorGlobal = null;

    if (!this.codigoIngresado || this.codigoIngresado.trim().length !== 6) {
      this.mensajeErrorGlobal = 'El código debe tener 6 dígitos.';
      return;
    }

    this.cargando.set(true);

    const payload: ValidarCodigoRequest = {
      correo: this.correoGuardado(),
      codigo: this.codigoIngresado.trim(),
    };

    this.authTutorService.validarCodigo(payload).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.tokenConfirmacion.set(respuesta.tokenConfirmacion);
        this.pasoActual.set(3);
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeErrorGlobal = err.error?.mensaje || 'Código inválido o expirado.';
      },
    });
  }
  procesarCambioContrasena(): void {
    this.mensajeErrorGlobal = null;

    if (this.nuevaContrasena.length < 8) {
      this.mensajeErrorGlobal = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mensajeErrorGlobal = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando.set(true);

    const payload: ConfirmarCambioRequest = {
      correo: this.correoGuardado(),
      tokenConfirmacion: this.tokenConfirmacion(),
      nuevaContrasena: this.nuevaContrasena,
    };

    this.authTutorService.confirmarCambioContrasena(payload).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.mensajeExito = respuesta.mensaje;
        this.pasoActual.set(4); // PANTALLA FINAL DE EXITO
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeErrorGlobal = err.error?.mensaje || 'No se pudo cambiar la contraseña.';
      },
    });
  }
}
