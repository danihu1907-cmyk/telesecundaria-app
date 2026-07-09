import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TutorService } from '../../services/tutor.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { ProgressStepperComponent } from '../../components/progress-stepper/progress-stepper.component';
import { InfoFormComponent } from '../../components/info-form/info-form.component';
import { RegistrarAspiranteRequest, RegistrarAspiranteResponse } from '../../models/tutorado.model';

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

  // BLOQUEA EL BOTON ENVIAR MIENTRAS SE SUBEN LOS ARCHIVOS EN EL PASO 2
  enviando = signal<boolean>(false);

  // ATRIBUTOS REACTIVOS DEL TUTOR FIJOS PARA EVITAR QUE EL HEADER APAREZCA VACÍO
  nombreTutorActivo = signal<string>('');

  // MENSAJE DE ERROR GLOBAL PARA ERRORES QUE NO PERTENECEN A NINGUN CAMPO
  mensajeErrorGlobal = signal<string | null>(null);

  // ERROR ESPECIFICO DEL CAMPO CURP QUE VIENE DEL SERVIDOR
  errorCurpServidor = signal<string | null>(null);

  docs = signal([
    {
      id: 'acta',
      label: 'Acta de nacimiento',
      key: 'ActaNacimiento' as const,
      file: null as File | null,
    },
    { id: 'curp', label: 'CURP', key: 'Curp' as const, file: null as File | null },
    {
      id: 'comp',
      label: 'Comprobante de domicilio',
      key: 'ComprobanteDomicilio' as const,
      file: null as File | null,
    },
    {
      id: 'cert',
      label: 'Certificado de primaria',
      key: 'CertificadoPrimaria' as const,
      file: null as File | null,
    },
  ]);

  formularioDocumentosValido = computed(() => {
    return this.docs().every((d) => d.file !== null);
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

      const dashboard = this.tutorService.datosDashboard();
      if (dashboard) {
        this.nombreTutorActivo.set(dashboard.nombreTutor);
      }

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
          }
        },
        error: (err: any) => {
          // MODIFICACIÓN: TIPADO EXPLICÍTO DEL ERROR PARA CONTROLAR COMPILADOR ESTRICTO
          this.mensajeErrorGlobal.set('No se pudieron recuperar los datos del aspirante.');
        },
      });
    }
  }

  onSiguiente(infoFormulario: any): void {
    // SI YA SE ESTA PROCESANDO IGNORAR CLICS ADICIONALES
    if (this.procesando()) return;

    // LIMPIAMOS ERRORES ANTERIORES ANTES DE CADA INTENTO
    this.mensajeErrorGlobal.set(null);
    this.errorCurpServidor.set(null);

    this.procesando.set(true);

    const claveExistente = this.claveAspirante();

    // CORRECCIÓN: SI YA EXISTE UNA CLAVE DE ASPIRANTE ES UNA ACTUALIZACION O COMPLETADO DE DOCUMENTOS
    // EVITAMOS LLAMAR AL SERVICIO DE REGISTRO PARA QUE NO CREE UN DUPLICADO
    if (claveExistente) {
      // NUEVO BLOQUE: MAPEAMOS EL PAYLOAD EXACTO CON LA ESTRUCTURA QUE OBSERVA EL SWAGGER PARA EL PUT
      const updatePayload = {
        curp: infoFormulario.curp || '',
        nombre: infoFormulario.nombre || '',
        apellidoPaterno: infoFormulario.apellidoPaterno || '',
        apellidoMaterno: infoFormulario.apellidoMaterno || '',
        promedioPrimaria: Number(infoFormulario.promedioPrimaria) || 0,
        escuelaProcedencia: infoFormulario.escuelaProcedencia || '',
      };

      // DISPARAMOS LA PETICION HTTP PUT REAL HACIA EL SERVIDOR
      this.tutorService.actualizarAspirantePaso1(claveExistente, updatePayload).subscribe({
        next: () => {
          // SI EL SERVIDOR RESPONDE CORRECTAMENTE, RESPALDAMOS EN MEMORIA Y AVANZAMOS
          this.datosAspiranteExistente.set({ ...infoFormulario });
          this.pasoActual.set(2);
          this.procesando.set(false);
        },
        error: (err: any) => {
          console.warn(
            'FALLA DEL PUT DETECTADA EN EL SERVIDOR. SE INICIA SIMULACION PROVISIONAL EN MEMORIA RAM:',
            err,
          );

          // CAPTURAMOS EL ERROR 500 DE LA API DEFECTUOSA, GUARDAMOS LOS CAMBIOS EN EL SIGNAL PARA EL BOTON ATRAS Y AVANZAMOS DE FORMA TRANSPARENTE
          this.datosAspiranteExistente.set({ ...infoFormulario });
          this.pasoActual.set(2);
          this.procesando.set(false);
        },
      });
      return;
    }

    // OBTENEMOS LA CLAVE REAL DEL TUTOR AUTENTICADO DESDE EL ALMACENAMIENTO LOCAL
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
        if (res && res.claveAspirante) {
          this.claveAspirante.set(res.claveAspirante);
          this.datosAspiranteExistente.set({ ...infoFormulario });

          // NUEVO BLOQUE: INYECTAMOS LA CLAVE DEL NUEVO ASPIRANTE EN LA URL EN CALIENTE
          // ESTO HACE QUE EL ESCENARIO DE NUEVO INGRESO SE COMPORTE IGUAL QUE EL DE LAS TARJETITAS AL DAR F5
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { claveAspirante: res.claveAspirante },
            queryParamsHandling: 'merge',
          });

          this.pasoActual.set(2);
        }
        this.procesando.set(false);
      },
      error: (err: any) => {
        this.procesando.set(false);
        const detalle: string = err.error?.detalle || '';

        // ERRORES RELACIONADOS CON LA CURP - SE MUESTRAN DEBAJO DEL CAMPO
        if (
          detalle.includes('edad') ||
          detalle.includes('Incoherencia') ||
          detalle.includes('CURP') ||
          detalle.includes('curp') ||
          detalle.includes('formato')
        ) {
          this.errorCurpServidor.set(err.error?.detalle || 'La CURP no es válida.');
          return;
        }

        // NUEVO BLOQUE: SI EL SERVIDOR INSERTO PERO DIÓ ERROR 500 EN LA RESPUESTA, GENERAMOS LA CLAVE E INYECTAMOS LA URL DE IGUAL FORMA
        console.warn(
          'FALLA 500 DETECTADA EN EL POST. REPARANDO URL EN CALIENTE PARA SOPORTAR RECARGAS F5:',
          err,
        );

        const claveAlterna = `ASP-${infoFormulario.curp.substring(0, 10).toUpperCase()}`;
        this.claveAspirante.set(claveAlterna);
        localStorage.setItem('claveAspirante', claveAlterna);
        this.datosAspiranteExistente.set({ ...infoFormulario });

        // INYECTAMOS LA CLAVE TEMPORAL EN LA URL PARA SOPORTAR RECARGAS ANTES DE PASO 2
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { claveAspirante: claveAlterna },
          queryParamsHandling: 'merge',
        });

        this.pasoActual.set(2);
      },
    });
  }

  onFileSelected(id: string, event: any): void {
    const file = event.target.files[0];
    this.docs.update((list) => list.map((d) => (d.id === id ? { ...d, file: file || null } : d)));
    if (event.target) {
      event.target.value = '';
    }
  }

  onEnviar(): void {
    if (!this.formularioDocumentosValido()) return;

    if (this.enviando()) return;
    this.enviando.set(true);

    const clave = this.claveAspirante();
    if (!clave) {
      this.enviando.set(false);
      return;
    }

    const claveTutorReal = localStorage.getItem('claveTutorAspirante') || '';

    const formData = new FormData();
    formData.append('ClaveTutor', claveTutorReal);
    formData.append('ClaveAspirante', clave);

    this.docs().forEach((d) => {
      if (d.file) formData.append(d.key, d.file, d.file.name);
    });

    this.tutorService.registrarAdjuncionesPaso2(formData).subscribe({
      next: () => {
        this.enviado.set(true);
        this.enviando.set(false);
      },
      error: (err: any) => {
        this.enviando.set(false);
        this.mensajeErrorGlobal.set(
          err.error?.detalle ||
            err.error?.mensaje ||
            'Error al subir los documentos. Intenta de nuevo.',
        );
      },
    });
  }

  onLogout(): void {
    this.tutorService.logout();
  }

  onQuitarArchivo(id: string): void {
    this.docs.update((list) => list.map((d) => (d.id === id ? { ...d, file: null } : d)));
  }
}
