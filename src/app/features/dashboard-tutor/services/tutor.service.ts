import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // INYECCIÓN OBLIGATORIA PARA EL CIERRE DE SESIÓN
import { Observable, of, throwError, delay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Ajusta la ruta según tu proyecto
import {
  RegistrarAspiranteRequest,
  RegistrarAspiranteResponse,
  DashboardTutorResponse,
  AspiranteTarjetaDashboard,
} from '../models/tutorado.model';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  // VARIABLES DE ESTADO REACTIVAS (SIGNALS) PARA EL DASHBOARD
  private datosDashboardSignal = signal<DashboardTutorResponse | null>(null);
  private cargandoSignal = signal<boolean>(false);

  // EXUESTAS PARA LECTURA EN COMPONENTES
  public datosDashboard = this.datosDashboardSignal.asReadonly();
  public cargando = this.cargandoSignal.asReadonly();

  // INYECCIÓN MODERNA DE DEPENDENCIAS UTILIZANDO INJECT
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  // =========================================================================
  // VERSION 1: ESCENARIO ACTIVO CON MOCKING (SIMULACIÓN EN MEMORIA)
  // =========================================================================

  // Datos simulados iniciales de un tutor (David Nieves) que ya tiene un hijo al 50%
  private mockDashboardData: DashboardTutorResponse = {
    nombre_tutor: 'David Nieves',
    aspirantes: [
      {
        id_aspirante: 1,
        claveAspirante: 'ASP-2026-001',
        nombre_completo: 'XIMENA NIEVES',
        estatus_tramite: 'Documentos incompletos',
        porcentaje_progreso: 50,
      },
    ],
  };

  obtenerDashboardTutorMock(claveTutorAspirante: string): Observable<DashboardTutorResponse> {
    this.cargandoSignal.set(true);
    console.log(`[MOCK] Solicitando Dashboard para el tutor: ${claveTutorAspirante}`);

    // Devolvemos el estado simulado con un retraso para probar los Spinners visuales
    return of(this.mockDashboardData).pipe(
      delay(1000),
      tap((data) => {
        this.datosDashboardSignal.set(data);
        this.cargandoSignal.set(false);
      }),
    );
  }

  registrarAspirantePaso1Mock(
    payload: RegistrarAspiranteRequest,
  ): Observable<RegistrarAspiranteResponse> {
    console.log('[MOCK] Ejecutando SP_INSERTAR_ASPIRANTE en el servidor simulado');
    console.log('[MOCK] Datos del niño recibidos:', payload);

    // Simulamos la respuesta exitosa generando una clave ficticia
    const respuestaSimulada: RegistrarAspiranteResponse = {
      success: true,
      message: 'LOS DATOS PERSONALES DEL ASPIRANTE SE HAN REGISTRADO CORRECTAMENTE.',
      claveAspirante: 'ASP-2026-999', // Clave de retorno para el Paso 2
    };

    return of(respuestaSimulada).pipe(
      delay(1500),
      tap(() => {
        // Actualizamos el estado del Dashboard en memoria RAM de forma reactiva
        // Añadimos al nuevo niño con el 50% de progreso
        const nuevoAspirante: AspiranteTarjetaDashboard = {
          id_aspirante: Math.floor(Math.random() * 1000),
          claveAspirante: respuestaSimulada.claveAspirante,
          nombre_completo:
            `${payload.nombre} ${payload.apellidoPaterno} ${payload.apellidoMaterno}`.toUpperCase(),
          estatus_tramite: 'Documentos incompletos',
          porcentaje_progreso: 50,
        };

        const actual = this.mockDashboardData.aspirantes;
        this.mockDashboardData.aspirantes = [...actual, nuevoAspirante];
        this.datosDashboardSignal.set({ ...this.mockDashboardData });
      }),
    );
  }

  registrarAdjuncionesPaso2Mock(
    formData: FormData,
  ): Observable<{ success: boolean; message: string }> {
    console.log('[MOCK] Enviando multipart/form-data al endpoint masivo de Adjunciones');

    // Inspección de los archivos que van en el FormData simulado
    const claveAspirante = formData.get('ClaveAspirante') as string;
    console.log(`[MOCK] Subiendo archivos para el aspirante: ${claveAspirante}`);

    return of({
      success: true,
      message: 'TODOS LOS DOCUMENTOS FUERON VERIFICADOS Y GUARDADOS EN EL SERVIDOR.',
    }).pipe(
      delay(2000),
      tap(() => {
        // Buscamos al niño en nuestro estado simulado y lo subimos al 100%
        const aspirantesActualizados = this.mockDashboardData.aspirantes.map((asp) => {
          if (asp.claveAspirante === claveAspirante) {
            return {
              ...asp,
              estatus_tramite: 'En revisión' as const,
              porcentaje_progreso: 100,
            };
          }
          return asp;
        });

        this.mockDashboardData.aspirantes = aspirantesActualizados;
        this.datosDashboardSignal.set({ ...this.mockDashboardData });
      }),
    );
  }

  // =========================================================================
  // GESTIÓN DE SEGURIDAD Y LIMPIEZA GLOBALES DE LA APLICACIÓN
  // =========================================================================

  logout(): void {
    // 1. ELIMINA EL TOKEN DEL DISCO DURO LOCAL (LOCALSTORAGE)
    localStorage.removeItem('token_control_escolar');

    // 2. REINICIA EL ESTADO DE LOS SIGNALS PARA BLINDAR LA RAM
    this.datosDashboardSignal.set(null);
    this.cargandoSignal.set(false);

    // 3. EXPULSA AL TUTOR EXPULSÁNDOLO DIRECTAMENTE HACIA LA PANTALLA DE LOGIN
    this.router.navigate(['/auth/login']);
  }

  /* =========================================================================
  VERSION 2: ESCENARIO REAL CON SERVIDOR (COMENTADO PARA SWITCH EN PRODUCCIÓN)
  =========================================================================

  obtenerDashboardTutor(claveTutorAspirante: string): Observable<DashboardTutorResponse> {
    this.cargandoSignal.set(true);
    const url = environment.production
      ? `${environment.apiUrl}/api/aspirantes/tutor/${claveTutorAspirante}`
      : `http://localhost:3000/api/aspirantes/tutor/${claveTutorAspirante}`;

    return this.http.get<DashboardTutorResponse>(url).pipe(
      tap({
        next: (data) => this.datosDashboardSignal.set(data),
        finalize: () => this.cargandoSignal.set(false)
      })
    );
  }

  registrarAspirantePaso1(payload: RegistrarAspiranteRequest): Observable<RegistrarAspiranteResponse> {
    const url = environment.production
      ? `${environment.apiUrl}/api/aspirantes/registrar`
      : `http://localhost:3000/api/aspirantes/registrar`;

    return this.http.post<RegistrarAspiranteResponse>(url, payload);
  }

  registrarAdjuncionesPaso2(formData: FormData): Observable<{ success: boolean; message: string }> {
    // Al ser archivos físicos (Blob/File), el content-type se configura automáticamente como multipart/form-data
    const url = environment.production
      ? `${environment.apiUrl}/api/Adjunciones/registrar`
      : `http://localhost:3000/api/Adjunciones/registrar`;

    return this.http.post<{ success: boolean; message: string }>(url, formData);
  }
  */
}
