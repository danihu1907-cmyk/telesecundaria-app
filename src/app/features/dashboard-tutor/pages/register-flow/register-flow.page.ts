import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TutorService } from '../../services/tutor.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { ProgressStepperComponent } from '../../components/progress-stepper/progress-stepper.component';
import { InfoFormComponent } from '../../components/info-form/info-form.component';
import {
  RegistrarAspiranteRequest,
  RegistrarAspiranteResponse,
  TarjetaDocumento,
} from '../../models/tutorado.model';

@Component({
  selector: 'app-register-flow',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardHeaderComponent,
    ProgressStepperComponent,
    InfoFormComponent,
  ],
  templateUrl: './register-flow.page.html',
  styleUrl: './register-flow.page.css',
})
export class RegisterFlowComponent implements OnInit {
  private tutorService = inject(TutorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // EL FLUJO DEBE INICIAR SIEMPRE EN EL PASO 1 PARA REVISIÓN DE CAMPOS
  pasoActual = signal<number>(1);
  enviado = signal<boolean>(false);
  claveAspirante = signal<string | null>(null);
  datosAspiranteExistente = signal<any | null>(null);

  // BLOQUEA EL BOTON SEGUIR MIENTRAS SE PROCESA LA PETICION DEL PASO 1
  procesando = signal<boolean>(false);

  // BLOQUEA EL FLUJO MIENTRAS SE SUBEN LOS ARCHIVOS O SE PROCESA LA FINALIZACIÓN AUTOMÁTICA
  enviando = signal<boolean>(false);

  // ATRIBUTOS REACTIVOS DEL TUTOR FIJOS PARA EVITAR QUE EL HEADER APAREZCA VACÍO
  nombreTutorActivo = signal<string>('');

  // MENSAJE DE ERROR GLOBAL PARA ERRORES QUE NO PERTENECEN A NINGUN CAMPO
  mensajeErrorGlobal = signal<string | null>(null);

  // ERROR ESPECIFICO DEL CAMPO CURP QUE VIENE DEL SERVIDOR
  errorCurpServidor = signal<string | null>(null);

  // NUEVO SIGNAL DINÁMICO REFACTORIZADO QUE SUSTITUYE LA LISTA ESTATICA ANTERIOR
  tarjetasDocs = signal<TarjetaDocumento[]>([]);

  // NUEVO COMPUTED: CALCULA LAS INICIALES REALES DINÁMICAMENTE (P. EJ. "DIEGO NOVELO" -> "DN")
  inicialesTutor = computed(() => {
    const nombre = this.nombreTutorActivo().trim();
    if (!nombre) return '';
    const partes = nombre.split(/\s+/);
    return partes.length >= 2
      ? (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase()
      : partes[0].charAt(0).toUpperCase();
  });

  // MODIFICADO: EL COMPUTED AHORA VALIDA EXCLUSIVAMENTE QUE TODOS LOS DOCUMENTOS FÍSICOS ESTÉN CARGADOS EN EL SERVIDOR
  formularioDocumentosValido = computed(() => {
    const lista = this.tarjetasDocs();
    return lista.length > 0 && lista.every((d) => d.cargadoEnServidor);
  });

  ngOnInit(): void {
    // CARGAMOS EL NOMBRE DEL TUTOR DESDE EL LOCALSTORAGE
    const nombreGuardado = localStorage.getItem('nombreTutor') ?? '';
    this.nombreTutorActivo.set(nombreGuardado);

    const clave = this.route.snapshot.queryParamMap.get('claveAspirante');
    if (clave) {
      this.claveAspirante.set(clave);

      // EL PASO SE MANTIENE EN 1 PARA MOSTRAR LOS INPUTS PRECARGADOS
      this.pasoActual.set(1);

      // ELIMINADA LA DOBLE ASIGNACIÓN REDUNDANTE DE nombreTutorActivo DESDE datosDashboard PORQUE LA FUENTE DE VERDAD AHORA ES EXCLUSIVAMENTE LOCALSTORAGE

      // MODIFICACIÓN: CONSUMIMOS EL NUEVO MÉTODO PARA EXTRAER LOS DATOS COMPLETOS DE LA BASE DE DATOS USANDO LA CLAVE DEL ALUMNO
      this.tutorService.obtenerAspirantePorClave(clave).subscribe({
        next: (alumno) => {
          if (alumno) {
            // MODIFICACIÓN: ASIGNAMOS LOS CAMPOS DIRECTOS DESDE LA RESPUESTA ORIGINAL DEL SERVIDOR ELIMINANDO LO HARCODEADO
            this.datosAspiranteExistente.set({
              nombre: alumno.nombre || '',
              apellidoPaterno: alumno.apellidoPaterno || '',
              apellidoMaterno: alumno.apellidoMaterno || '',
              curp: alumno.curp || '', // SOLUCIONADO: YA NO USA LA CLAVE SINO LA CURP VERDADERA DE 18 CARACTERES
              escuelaProcedencia: alumno.escuelaProcedencia || '',
              promedioPrimaria: alumno.promedioPrimaria || null,
              discapacidadTexto: alumno.tieneDiscapacidad ? 'Sí' : 'No',
              nombreEnfermedad: alumno.nombreEnfermedad || '',
              hermanoTexto: alumno.hermanoPlantel ? 'Sí' : 'No',
              curpHermano: alumno.curpHermano || '',
            });

            // NUEVO BLOQUE: DISPARAMOS LAS CONSULTAS EN PARALELO PARA CARGAR EL PASO 2 EN SEGUNDO PLANO POR SI EL TUTOR AVANZA
            this.cargarConfiguracionYEstadoDocumentos(clave);
          }
        },
        error: () => {
          // MODIFICACIÓN: TIPADO EXPLICÍTO DEL ERROR PARA CONTROLAR COMPILADOR ESTRICTO
          this.mensajeErrorGlobal.set('No se pudieron recuperar los datos del aspirante.');
        },
      });
    }
  }

  // NUEVO MÉTODO: TRAE EL CATÁLOGO COMPLETO DE LA BD Y EL EXPEDIENTE DEL ALUMNO DE FORMA SIMULTÁNEA CRUIZANDO LAS CLAVES RELACIONALES
  private cargarConfiguracionYEstadoDocumentos(clave: string): void {
    forkJoin({
      catalogo: this.tutorService.getTipoDocumentos(),
      estadoExpediente: this.tutorService.getEstadoAdjuncion(clave),
    }).subscribe({
      next: ({ catalogo, estadoExpediente }) => {
        // FILTRAMOS UNICAMENTE LOS COMPONENTES PERTENECIENTES AL PROCESO ACADÉMICO DE PREINSCRIPCIÓN
        const documentosPreinscripcion = catalogo.filter((doc) => doc.area === 'Preinscripción');

        // MAPEAMOS DIRECTAMENTE HACIA LA INTERFAZ COMPUESTA DE CONTROL VISUAL DINÁMICO
        const tarjetasMapeadas = documentosPreinscripcion.map((doc): TarjetaDocumento => {
          // CORRECCIÓN DE LLAVE DE VALIDACIÓN: COMPARAMOS EL TEXTO COMPLETO DEL DOCUMENTO EN LUGAR DEL CÓDIGO TIPO-0001
          const yaSubido = estadoExpediente?.documentosCargados
            ? estadoExpediente.documentosCargados.some(
                (cargado: any) => cargado.tipoDocumento === doc.nombreDocumento,
              )
            : false;

          return {
            claveTipoDocumento: doc.claveTipoDocumento,
            nombreDocumento: doc.nombreDocumento,
            descripcion: doc.descripcion,
            archivoSeleccionado: null,
            cargadoEnServidor: yaSubido,
          };
        });

        this.tarjetasDocs.set(tarjetasMapeadas);

        // NUEVO BLOQUE AUTOMÁTICO: SI EL ASPIRANTE YA TIENE LOS 5 ARCHIVOS LISTOS DESDE QUE ENTRA A LA PÁGINA (ESCENARIO RE RECARGA),
        // EVALUAMOS LA EJECUCIÓN DEL ENVIAR AUTOMÁTICO PARA PREVENIR EL BLOQUEO FANTASMA.
        if (this.formularioDocumentosValido() && !this.enviado()) {
          this.onEnviar();
        }
      },
      error: (err) => {
        console.error('ERROR AL CARGAR LA ARQUITECTURA DE ARCHIVOS DE LA TELESECUNDARIA:', err);
      },
    });
  }

  onSiguiente(infoFormulario: any): void {
    if (this.procesando()) return;

    this.mensajeErrorGlobal.set(null);
    this.errorCurpServidor.set(null);
    this.procesando.set(true);

    const claveExistente = this.claveAspirante();
    if (claveExistente) {
      const updatePayload = {
        curp: infoFormulario.curp || '',
        nombre: infoFormulario.nombre || '',
        apellidoPaterno: infoFormulario.apellidoPaterno || '',
        apellidoMaterno: infoFormulario.apellidoMaterno || '',
        promedioPrimaria: Number(infoFormulario.promedioPrimaria) || 0,
        escuelaProcedencia: infoFormulario.escuelaProcedencia || '',
      };

      this.tutorService.actualizarAspirantePaso1(claveExistente, updatePayload).subscribe({
        next: () => {
          this.datosAspiranteExistente.set({ ...infoFormulario });
          this.pasoActual.set(2);
          this.procesando.set(false);
        },
        error: (err: any) => {
          console.error('ERROR REAL AL ACTUALIZAR EL ASPIRANTE EN EL SERVIDOR:', err);
          const detalleReal =
            err.error?.detalle ||
            err.error?.mensaje ||
            'No se pudo actualizar la información. Intenta de nuevo.';
          this.mensajeErrorGlobal.set(detalleReal);
          this.procesando.set(false);
        },
      });
      return;
    }

    const claveTutorReal = localStorage.getItem('claveTutorAspirante') || '';
    const payload: RegistrarAspiranteRequest = {
      nombre: infoFormulario.nombre || '',
      apellidoPaterno: infoFormulario.apellidoPaterno || '',
      apellidoMaterno: infoFormulario.apellidoMaterno || '',
      curp: infoFormulario.curp || '',
      escuelaProcedencia: infoFormulario.escuelaProcedencia || '',
      promedioPrimaria: Number(infoFormulario.promedioPrimaria) || 0,
      discapacidadTexto: infoFormulario.discapacidadTexto || '',
      nombreEnfermedad: infoFormulario.nombreEnfermedad || '',
      hermanoTexto: infoFormulario.hermanoTexto || '',
      curpHermano: infoFormulario.curpHermano || '',
      claveTutorAspirante: claveTutorReal,
    };

    this.tutorService.registrarAspirantePaso1(payload).subscribe({
      next: (res: RegistrarAspiranteResponse) => {
        if (res?.claveAspirante) {
          this.claveAspirante.set(res.claveAspirante);
          this.datosAspiranteExistente.set({ ...infoFormulario });

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { claveAspirante: res.claveAspirante },
            queryParamsHandling: 'merge',
          });

          this.cargarConfiguracionYEstadoDocumentos(res.claveAspirante);
          this.pasoActual.set(2);
        }
        this.procesando.set(false);
      },
      error: (err: any) => {
        this.procesando.set(false);
        const detalle: string = err.error?.detalle || '';

        if (
          ['edad', 'Incoherencia', 'CURP', 'curp', 'formato'].some((word) => detalle.includes(word))
        ) {
          this.errorCurpServidor.set(err.error?.detalle || 'La CURP no es válida.');
          return;
        }

        console.error('ERROR REAL AL REGISTRAR EL ASPIRANTE EN EL SERVIDOR:', err);
        const detalleReal =
          err.error?.detalle ||
          err.error?.mensaje ||
          'No se pudo registrar al aspirante. Intenta de nuevo.';
        this.mensajeErrorGlobal.set(detalleReal);
      },
    });
  }

  // NUEVO MÉTODO: DISPARA EL LLAMADO HTTP TEMPORAL AL INSTANTE EN QUE EL TUTOR ADJUNTA EL BINARIO EN CUALQUIER TARJETA
  onFileSelected(claveTipoDocumento: string, event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const claveAsp = this.claveAspirante();
    const tarjeta = this.tarjetasDocs().find((d) => d.claveTipoDocumento === claveTipoDocumento);
    if (!claveAsp || !tarjeta) return;

    const formData = new FormData();
    formData.append('ClaveAspirante', claveAsp);
    formData.append('TipoDocumento', tarjeta.nombreDocumento);
    formData.append('Archivo', file, file.name);

    // OPTIMIZACIÓN: SE ELIMINÓ EL PASO REDUNDANTE DE ASIGNAR EL ARCHIVOSELECCIONADO ANTES DE ENVIAR DEBIDO A QUE NO SE RENDERIZAN BARRAS DE PROGRESO INDIVIDUALES NI ESTADOS DE CANCELACIÓN EN LA VISTA FÍSICA

    this.tutorService.subirDocumentoTemporal(formData).subscribe({
      next: () => {
        this.mensajeErrorGlobal.set(null);
        this.tarjetasDocs.update((lista) =>
          lista.map((d) =>
            d.claveTipoDocumento === claveTipoDocumento
              ? { ...d, cargadoEnServidor: true, archivoSeleccionado: null }
              : d,
          ),
        );

        // =========================================================================
        // JUGADA SUCIA INTELIGENTE AUTOMÁTICA
        // =========================================================================
        // SI AL TERMINAR DE SUBIR ESTE ARCHIVO, LA LISTA SE ENCUENTRA COMPLETAMENTE EN VERDE (100%),
        // EJECUTAMOS LA DESTRUCCIÓN DE LOS TEMPORALES Y LA CREACIÓN DEL EXPEDIENTE DE FORMA TRANSPARENTE.
        if (this.formularioDocumentosValido()) {
          this.onEnviar();
        }
      },
      error: (err) => {
        const errorMsg =
          err.error?.mensaje || 'No se pudo cargar el archivo en el servidor remoto.';
        this.mensajeErrorGlobal.set(errorMsg);

        this.tarjetasDocs.update((lista) =>
          lista.map((d) =>
            d.claveTipoDocumento === claveTipoDocumento ? { ...d, archivoSeleccionado: null } : d,
          ),
        );
      },
    });

    if (event.target) {
      event.target.value = '';
    }
  }

  // REFACTORIZADO: REALIZA EL CIERRE DEFINITIVO E INMUTABLE DEL EXPEDIENTE ACADÉMICO COMPLETADO
  onEnviar(): void {
    if (this.enviando()) return;
    this.enviando.set(true);

    const clave = this.claveAspirante();
    if (!clave) {
      this.enviando.set(false);
      return;
    }

    const claveTutorReal = localStorage.getItem('claveTutorAspirante') || '';
    const payloadFinalizar = { ClaveTutor: claveTutorReal, ClaveAspirante: clave };

    this.tutorService.finalizarTramite(payloadFinalizar).subscribe({
      next: () => {
        this.enviado.set(true);
        this.enviando.set(false);
        this.mensajeErrorGlobal.set(null);

        // NUEVO BLOQUE DE SINCRONIZACIÓN AUTOMÁTICA: FORZAMOS AL SERVICIO PRINCIPAL A REFRESCAR EL
        // CONTENEDOR DE SIGNALS PARA QUE AL REGRESAR AL DASHBOARD LA BARRA YA MARQUE 100% Y EL BADGE CAMBIE.
        this.tutorService.obtenerDashboardTutor().subscribe();
      },
      error: (err: any) => {
        this.enviando.set(false);
        const errorMsg =
          err.error?.mensaje || err.error?.detalle || 'Error al dar el cierre final al expediente.';
        this.mensajeErrorGlobal.set(errorMsg);
      },
    });
  }

  onLogout(): void {
    this.tutorService.logout();
  }
}
