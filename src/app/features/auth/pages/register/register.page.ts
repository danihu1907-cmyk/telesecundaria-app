import { Component, signal, OnInit } from '@angular/core'; // IMPORTAMOS SIGNAL DESDE EL NUCLEO DE ANGULAR
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // REQUERIDO OBLIGATORIAMENTE EN COMPONENTES STANDALONE
import { FormsModule } from '@angular/forms'; // LIBRERIA INTEGRADA PARA DAR SOPORTE A NGMODEL
import { AuthTutorService } from '../../../../core/services/auth-tutor.service'; // <-- SE CORRIGE LA RUTA AL NUEVO SERVICIO GLOBAL EN CORE
import { BannerHeroService } from '../../../landing/services/banner-hero.service'; // <-- INYECCIÓN DEL SERVICIO DE PUBLICACIONES PARA EL CONTROL DE ACCESO
import { RegistroTutorRequest } from '../../models/auth.models';
import { Publicacion } from '../../../landing/models/publicacion.model';

@Component({
  selector: 'app-register',
  standalone: true, // CONFIGURACION DE LA NUEVA ARQUITECTURA INDEPENDIENTE DE ANGULAR
  imports: [CommonModule, FormsModule, RouterModule], // INTEGRACION DE HERRAMIENTAS DIRECTAS PARA EL COMPONENTE
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {
  // CONVERTIMOS LAS VARIABLES DE FLUJO EN SIGNALS REACTIVOS
  pasoActual = signal<number>(1);
  cargando = signal<boolean>(false);
  mensajeExito: string | null = null;

  // SIGNALS CONTROLADORES PARA PREVENIR ENTRADAS FORZADAS POR URL DIRECTA
  convocatoriaCerrada = signal<boolean>(false);
  cargandoValidacion = signal<boolean>(true);

  // DICCIONARIO DE ERRORES INDEPENDIENTES CON TEXTO EN MINÚSCULAS TIPO ORACIÓN
  erroresCampos: { [key: string]: string | null } = {
    nombre: null,
    apellido_paterno: null,
    curp_tutor: null,
    telefono: null,
    calle_numero: null,
    colonia: null,
    codigo_postal: null,
    municipio: null,
    correo: null,
    contrasena: null,
    confirmarContrasena: null,
  };

  // OBJETO UNIFICADO QUE RECOLECTARA LOS PARAMETROS DURANTE EL PROCESO
  datosRegistro: RegistroTutorRequest = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    curp_tutor: '',
    telefono: '',
    parentesco: '',
    calle_numero: '',
    colonia: '',
    codigo_postal: '',
    municipio: '',
    correo: '',
    contrasena: '',
  };

  // PROPIEDAD ADICIONAL SOLO PARA LA VALIDACION VISUAL EN LA PANTALLA
  confirmarContrasena: string = '';

  constructor(
    private authService: AuthTutorService,
    private bannerService: BannerHeroService, // <-- AGREGADO AL CONSTRUCTOR PARA LEER EL JSON DESDE EL SERVICIO EXISTENTE
    private router: Router,
  ) {}

  // AL INICIALIZAR EL COMPONENTE SE EVALÚA EL SEMÁFORO DE LA CONVOCATORIA
  ngOnInit(): void {
    this.bannerService.obtenerBanners().subscribe({
      next: (datos: Publicacion[]) => {
        const tieneConvocatoria = datos.some(
          (p: Publicacion) => p.categoria === 'Convocatoria' && p.estatusVisible,
        );

        // SI NO ENCUENTRA NINGUNA CONVOCATORIA ACTIVA SE LEVANTA EL CANDADO DE BLOQUEO
        this.convocatoriaCerrada.set(!tieneConvocatoria);
        this.cargandoValidacion.set(false);
      },
      error: (err) => {
        console.error('ERROR AL VALIDAR ESTADO DE CONVOCATORIAS EN REGISTRO:', err);
        this.convocatoriaCerrada.set(true);
        this.cargandoValidacion.set(false);
      },
    });
  }

  // FUNCIÓN DE CONTROL INTERNO PARA BLOQUEAR LETRAS EN LA PC EN TIEMPO REAL
  soloNumeros(evento: KeyboardEvent): boolean {
    const carac = evento.key;
    if (carac < '0' || carac > '9') {
      evento.preventDefault();
      return false;
    }
    return true;
  }

  // LIMPIA LOS ERRORES DE UN CAMPO ESPECÍFICO CUANDO EL USUARIO EMPIEZA A ESCRIBIR NUEVAMENTE
  limpiarErrorCampo(campo: string): void {
    this.erroresCampos[campo] = null;
  }

  // LÓGICA DE CONTROL DE PASOS REESCRITA UTILIZANDO LOS METODOS .SET() DE LOS SIGNALS
  siguientePaso(): void {
    console.log('SE HIZO CLIC EN SIGUIENTE. PASO ACTUAL:', this.pasoActual());

    if (this.pasoActual() === 1) {
      this.erroresCampos['telefono'] = null;
      this.erroresCampos['curp_tutor'] = null;

      let tieneErrores = false;

      const patronTelefono = /^\d{10}$/;
      if (!patronTelefono.test(this.datosRegistro.telefono)) {
        this.erroresCampos['telefono'] =
          'El teléfono debe contener exactamente 10 dígitos numéricos.';
        tieneErrores = true;
      }

      const patronCurp = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i;
      if (!patronCurp.test(this.datosRegistro.curp_tutor)) {
        this.erroresCampos['curp_tutor'] = 'El formato de la CURP ingresada no es válido.';
        tieneErrores = true;
      }

      if (tieneErrores) {
        console.log('FLUJO DETENIDO POR ERRORES DE FORMATO VISIBLES.');
        return;
      }

      this.datosRegistro.curp_tutor = this.datosRegistro.curp_tutor.toUpperCase();
      this.cargando.set(true); // SE ESTABLECE EL VALOR EN TRUE CON LA SINTAXIS DE SIGNALS

      console.log('DISPARANDO DISPONIBILIDAD DE CURP HACIA EL SERVICIO...');

      this.authService.verificarCurpUnica(this.datosRegistro.curp_tutor).subscribe({
        next: (existeCurp) => {
          this.cargando.set(false);
          console.log('RESPUESTA EXITOSA DE LA API. ¿EXISTE LA CURP?:', existeCurp);

          if (existeCurp) {
            this.erroresCampos['curp_tutor'] =
              `La CURP ${this.datosRegistro.curp_tutor} ya se encuentra registrada.`;
          } else {
            this.pasoActual.set(2); // ACTUALIZACIÓN TOTALMENTE REACTIVA QUE ENTERA AL HTML AL INSTANTE
            console.log('CAMBIO EXITOSO REALIZADO AL PASO DOS.');
          }
        },
        error: (err) => {
          this.cargando.set(false);
          console.error('ERROR DETECTADO EN EL FLUJO HTTP DE LA API:', err);
          this.pasoActual.set(2); // PERMITIMOS EL AVANCE ANTE ERRORES CRÍTICOS DE CONEXIÓN
        },
      });
      return;
    }

    if (this.pasoActual() === 2) {
      this.erroresCampos['codigo_postal'] = null;

      let tieneErroresPasoDos = false;

      const patronCodigoPostal = /^\d{5}$/;
      if (!patronCodigoPostal.test(this.datosRegistro.codigo_postal)) {
        this.erroresCampos['codigo_postal'] =
          'El código postal debe contener exactamente 5 números.';
        tieneErroresPasoDos = true;
      }

      if (tieneErroresPasoDos) return;

      this.pasoActual.set(3); // ACTUALIZACIÓN TOTALMENTE REACTIVA AL PASO TRES
      return;
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.update((paso) => paso - 1); // UTILIZAMOS EL METODO UPDATE PARA RESTAR EL VALOR ANTERIOR
    }
  }

  procesarRegistroFinal(): void {
    this.erroresCampos['correo'] = null;
    this.erroresCampos['contrasena'] = null;
    this.erroresCampos['confirmarContrasena'] = null;
    this.mensajeExito = null;

    let tieneErroresPasoTres = false;

    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronCorreo.test(this.datosRegistro.correo)) {
      this.erroresCampos['correo'] = 'El formato del correo electrónico no es válido.';
      tieneErroresPasoTres = true;
    }

    if (this.datosRegistro.contrasena.length < 8) {
      this.erroresCampos['contrasena'] = 'La contraseña debe tener mínimo 8 caracteres.';
      tieneErroresPasoTres = true;
    }

    if (this.datosRegistro.contrasena !== this.confirmarContrasena) {
      this.erroresCampos['confirmarContrasena'] = 'Las contraseñas ingresadas no coinciden.';
      tieneErroresPasoTres = true;
    }

    if (tieneErroresPasoTres) return;

    this.cargando.set(true);

    this.authService.registrarTutorCompleto(this.datosRegistro).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.mensajeExito = respuesta.message;

        if (respuesta.token) {
          localStorage.setItem('token_control_escolar', respuesta.token); // <-- MANTIENE TU PERSISTENCIA EN EL DISCO CON EL MISMO NOMBRE CLAVE DEL SERVICIO
        }

        setTimeout(() => {
          this.router.navigate(['/dashboard/convocatorias']);
        }, 2000);
      },
      error: (err) => {
        this.cargando.set(false);
        this.erroresCampos['correo'] = err.message || 'Ocurrió un error al procesar el registro.';
      },
    });
  }

  // SE ELIMINÓ LA FUNCIÓN OBSOLETA irALogin() PORQUE YA SE RESUELVE DE MANERA NATIVA USANDO ROUTERLINK DESDE EL HTML
}
