import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TutorService } from '../../services/tutor.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { ProgressStepperComponent } from '../../components/progress-stepper/progress-stepper.component';
import { InfoFormComponent } from '../../components/info-form/info-form.component';
import { RegistrarAspiranteRequest } from '../../models/tutorado.model';

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
  nombreTutorActivo = signal<string>('David Nieves');

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
    const clave = this.route.snapshot.queryParamMap.get('claveAspirante');

    if (clave) {
      this.claveAspirante.set(clave);

      // EL PASO SE MANTIENE EN 1 PARA MOSTRAR LOS INPUTS PRECARGADOS
      this.pasoActual.set(1);

      const dashboard = this.tutorService.datosDashboard();
      if (dashboard) {
        this.nombreTutorActivo.set(dashboard.nombre_tutor);
      }

      const alumno = dashboard?.aspirantes.find((a) => a.claveAspirante === clave);
      if (alumno) {
        const nombres = alumno.nombre_completo.split(' ');
        this.datosAspiranteExistente.set({
          nombre: nombres[0] || '',
          apellidoPaterno: nombres[1] || '',
          apellidoMaterno: nombres[2] || '',
          curp: alumno.claveAspirante,
          escuelaProcedencia: 'Primaria General Benito Juárez',
          promedioPrimaria: 9.5,
          discapacidadTexto: 'No',
          nombreEnfermedad: '',
          hermanoTexto: 'No',
          curpHermano: '',
        });
      }
    }
  }

  onSiguiente(infoFormulario: any): void {
    // SI YA SE ESTA PROCESANDO IGNORAR CLICS ADICIONALES
    if (this.procesando()) return;
    this.procesando.set(true);

    // CORRECCIÓN: Si ya existe una clave de aspirante, es una actualización o completado de documentos.
    // Evitamos llamar al servicio de registro para que no cree un duplicado (ASP-2026-999).
    if (this.claveAspirante()) {
      this.pasoActual.set(2);
      this.procesando.set(false);
      return;
    }

    const payload: RegistrarAspiranteRequest = {
      nombre: infoFormulario.nombre,
      apellidoPaterno: infoFormulario.apellidoPaterno,
      apellidoMaterno: infoFormulario.apellidoMaterno,
      curp: infoFormulario.curp,
      escuelaProcedencia: infoFormulario.escuelaProcedencia,
      promedioPrimaria: Number(infoFormulario.promedioPrimaria),
      discapacidadTexto: infoFormulario.discapacidadTexto,
      nombreEnfermedad: infoFormulario.nombreEnfermedad || '',
      hermanoTexto: infoFormulario.hermanoTexto,
      curpHermano: infoFormulario.curpHermano || '',
      claveTutorAspirante: 'TUT-2026-MOCK',
    };

    this.tutorService.registrarAspirantePaso1Mock(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.claveAspirante.set(res.claveAspirante);
          this.pasoActual.set(2);
        }
        // LIBERA EL BOTON AL TERMINAR LA PETICION
        this.procesando.set(false);
      },
      error: () => {
        // LIBERA EL BOTON SI LA PETICION FALLA
        this.procesando.set(false);
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

    // SI YA SE ESTA ENVIANDO IGNORAR CLICS ADICIONALES
    if (this.enviando()) return;
    this.enviando.set(true);

    const clave = this.claveAspirante();
    if (!clave) {
      this.enviando.set(false);
      return;
    }

    const formData = new FormData();
    formData.append('ClaveTutor', 'TUT-2026-MOCK');
    formData.append('ClaveAspirante', clave);

    this.docs().forEach((d) => {
      if (d.file) formData.append(d.key, d.file, d.file.name);
    });

    this.tutorService.registrarAdjuncionesPaso2Mock(formData).subscribe({
      next: () => {
        this.enviado.set(true);
        // LIBERA EL BOTON AL TERMINAR LA SUBIDA
        this.enviando.set(false);
      },
      error: () => {
        // LIBERA EL BOTON SI LA SUBIDA FALLA
        this.enviando.set(false);
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
