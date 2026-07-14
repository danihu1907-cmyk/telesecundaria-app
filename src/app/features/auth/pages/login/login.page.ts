import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthTutorService } from '../../../../core/services/auth-tutor.service';
import { LoginRequest } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  cargando = signal<boolean>(false);
  mensajeErrorGlobal: string | null = null;

  erroresCampos: { [key: string]: string | null } = {
    correo: null,
    contrasenia: null,
  };

  datosLogin: LoginRequest = {
    correo: '',
    contrasenia: '',
  };

  constructor(
    private authService: AuthTutorService,
    private router: Router,
  ) {}

  limpiarErrorCampo(campo: string): void {
    this.erroresCampos[campo] = null;
    this.mensajeErrorGlobal = null;
  }

  ejecutarLogin(): void {
    // 1. Limpiamos todos los errores antes de empezar a validar
    this.erroresCampos['correo'] = null;
    this.erroresCampos['contrasenia'] = null;
    this.mensajeErrorGlobal = null;

    let tieneErrores = false; // Esta bandera controlará si detenemos o no el flujo

    // 2. Validamos el Correo (No se detiene aquí si falla)
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronCorreo.test(this.datosLogin.correo)) {
      this.erroresCampos['correo'] = 'El formato del correo electrónico no es válido.';
      tieneErrores = true; // Marcamos que ya encontramos un error
    }

    // 3. Validamos la Contraseña (Se ejecuta SIEMPRE, sin importar el correo)
    if (this.datosLogin.contrasenia.length < 6) {
      this.erroresCampos['contrasenia'] = 'La contraseña debe contener al menos 6 caracteres.';
      tieneErrores = true; // Marcamos si también falla
    }

    // 4. SI cualquiera de los dos (o ambos) falló, AQUÍ es donde detenemos todo
    if (tieneErrores) {
      console.log('Validación fallida. Errores visuales activados en pantalla.');
      return;
    }

    // 5. Si todo está perfecto, procedemos con la petición al servidor
    this.cargando.set(true);

    this.authService.login(this.datosLogin).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        console.log('Login exitoso:', respuesta);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeErrorGlobal =
          err.error?.mensaje || 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      },
    });
  }

  // SE ELIMINARON LAS FUNCIONES OBSOLETAS DE NAVEGACIÓN MANUAL YA QUE AHORA SE ENCARGA EL ROUTERLINK DIRECTO EN EL HTML
}
