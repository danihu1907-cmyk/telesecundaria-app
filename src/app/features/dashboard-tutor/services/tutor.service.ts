import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  RegistrarAspiranteRequest,
  RegistrarAspiranteResponse,
  DashboardTutorResponse,
  AspiranteTarjetaDashboard,
  Aspirante,
  TipoDocumento,
  EstadoAdjuncion,
} from '../models/tutorado.model';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  // INYECCIÓN MODERNA DE DEPENDENCIAS UTILIZANDO INJECT
  private http = inject(HttpClient);
  private router = inject(Router);

  // VARIABLES DE ESTADO REACTIVAS (SIGNALS) PARA EL DASHBOARD
  private datosDashboardSignal = signal<DashboardTutorResponse | null>(null);
  private cargandoSignal = signal<boolean>(false);

  // EXUESTAS PARA LECTURA EN COMPONENTES
  public datosDashboard = this.datosDashboardSignal.asReadonly();
  public cargando = this.cargandoSignal.asReadonly();

  // =========================================================================
  // ESCENARIO REAL CON SERVIDOR (MOCK ELIMINADO COMPLETAMENTE)
  // =========================================================================

  obtenerDashboardTutor(): Observable<DashboardTutorResponse> {
    this.cargandoSignal.set(true);

    const claveTutorAspirante = localStorage.getItem('claveTutorAspirante') ?? '';
    const nombreTutor = localStorage.getItem('nombreTutor') ?? '';
    const url = `${environment.apiUrl}/Aspirantes`;

    return this.http.get<Aspirante[]>(url).pipe(
      map((aspirantes) => aspirantes.filter((a) => a.claveTutorAspirante === claveTutorAspirante)),

      switchMap((aspirantesFiltrados): Observable<AspiranteTarjetaDashboard[]> => {
        if (aspirantesFiltrados.length === 0) {
          return of([]);
        }

        const peticionesAspirantes = aspirantesFiltrados.map((a) => {
          // ESCENARIO A: SI EL ADMINISTRADOR YA LO ACEPTÓ -> 100% DE PROGRESO AUTOMÁTICO
          if (a.estatusAspirante === 'Aceptado') {
            return of({
              claveAspirante: a.claveAspirante,
              nombreCompleto:
                `${a.nombre ?? ''} ${a.apellidoPaterno ?? ''} ${a.apellidoMaterno ?? ''}`
                  .trim()
                  .toUpperCase(),
              estatusTramite: a.estatusAspirante,
              porcentajeProgreso: 100,
            });
          }

          // ESCENARIO B: SI ESTÁ 'EN PROCESO' O 'RECHAZADO' EN LA BASE DE DATOS -> LÓGICA DE ARCHIVOS
          return this.getEstadoAdjuncion(a.claveAspirante).pipe(
            map((estadoAdj: EstadoAdjuncion): AspiranteTarjetaDashboard => {
              // OBTENEMOS LAS PROPIEDADES DIRECTAS DESDE EL JSON DEL ENDPOINT DEL SERVIDOR
              const estanTodosCompletos = estadoAdj && estadoAdj.todosCompletos === true;

              // CONTAMOS CUÁNTOS DOCUMENTOS TIENE GUARDADOS FÍSICAMENTE EN EL SERVIDOR
              const totalArchivosSubidos =
                estadoAdj && estadoAdj.documentosCargados ? estadoAdj.documentosCargados.length : 0;

              // LÓGICA MATEMÁTICA REAL: 25% BASE + 15% POR CADA ARCHIVO (SI ESTÁN TODOS PASA A 100%)
              const calculoProgreso = 25 + totalArchivosSubidos * 15;
              let progresoReal = calculoProgreso > 100 ? 100 : calculoProgreso;

              // APLICACIÓN DE LA LÓGICA VIRTUAL RETORNANDO A LOS ESTADOS ORIGINALES DE LA BD
              let estatusCalculado = a.estatusAspirante;

              if (a.estatusAspirante === 'En proceso') {
                if (!estanTodosCompletos) {
                  estatusCalculado = 'Documentos incompletos';
                  progresoReal = 25 + totalArchivosSubidos * 15;
                } else if (estanTodosCompletos) {
                  estatusCalculado = 'En proceso';
                  progresoReal = 100;
                }
              } else if (a.estatusAspirante === 'Rechazado') {
                progresoReal = estanTodosCompletos ? 100 : 25 + totalArchivosSubidos * 15;
              }

              return {
                claveAspirante: a.claveAspirante,
                nombreCompleto:
                  `${a.nombre ?? ''} ${a.apellidoPaterno ?? ''} ${a.apellidoMaterno ?? ''}`
                    .trim()
                    .toUpperCase(),
                estatusTramite: estatusCalculado,
                porcentajeProgreso: progresoReal,
              };
            }),
            catchError(() =>
              of({
                claveAspirante: a.claveAspirante,
                nombreCompleto:
                  `${a.nombre ?? ''} ${a.apellidoPaterno ?? ''} ${a.apellidoMaterno ?? ''}`
                    .trim()
                    .toUpperCase(),
                estatusTramite: a.estatusAspirante,
                porcentajeProgreso: 25,
              }),
            ),
          );
        });

        return forkJoin(peticionesAspirantes) as Observable<AspiranteTarjetaDashboard[]>;
      }),

      map((tarjetasMapeadas): DashboardTutorResponse => {
        return {
          nombreTutor: nombreTutor,
          aspirantes: tarjetasMapeadas,
        };
      }),

      tap({
        next: (dashboardData) => {
          this.datosDashboardSignal.set(dashboardData);
          this.cargandoSignal.set(false);
        },
        error: (error) => {
          console.error('Error crítico al procesar el Dashboard con progreso dinámico:', error);
          this.cargandoSignal.set(false);
        },
      }),
    );
  }

  obtenerAspirantePorClave(clave: string): Observable<Aspirante | undefined> {
    const url = `${environment.apiUrl}/Aspirantes`;
    return this.http
      .get<Aspirante[]>(url)
      .pipe(map((aspirantes) => aspirantes.find((a) => a.claveAspirante === clave)));
  }

  actualizarAspirantePaso1(clave: string, payload: any): Observable<any> {
    const url = `${environment.apiUrl}/Aspirantes/${clave}`;
    return this.http.put(url, payload);
  }

  registrarAspirantePaso1(
    payload: RegistrarAspiranteRequest,
  ): Observable<RegistrarAspiranteResponse> {
    const url = `${environment.apiUrl}/Aspirantes`;
    return this.http.post<RegistrarAspiranteResponse>(url, payload).pipe(
      tap((res) => {
        if (res && res.claveAspirante) {
          localStorage.setItem('claveAspirante', res.claveAspirante);
        }
      }),
    );
  }

  getTipoDocumentos(): Observable<TipoDocumento[]> {
    const url = `${environment.apiUrl}/TipoDocumentos`;
    return this.http.get<TipoDocumento[]>(url);
  }

  getEstadoAdjuncion(claveAspirante: string): Observable<EstadoAdjuncion> {
    const url = `${environment.apiUrl}/Adjunciones/documentos/estado/${claveAspirante}`;
    return this.http.get<EstadoAdjuncion>(url);
  }

  subirDocumentoTemporal(formData: FormData): Observable<any> {
    const url = `${environment.apiUrl}/Adjunciones/documentos/temp`;
    return this.http.post<any>(url, formData);
  }

  finalizarTramite(payload: any): Observable<any> {
    const url = `${environment.apiUrl}/Adjunciones/finalizar`;
    return this.http.post<any>(url, payload);
  }

  logout(): void {
    localStorage.clear();
    this.datosDashboardSignal.set(null);
    this.router.navigate(['/auth/login']);
  }
}
