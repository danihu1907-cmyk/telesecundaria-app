import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type {
  Convocatoria,
  CreateConvocatoriaRequest,
  UpdateConvocatoriaRequest,
  EliminarConvocatoriaRequest,
} from '../models/convocatorias.models';
import { catchError, map, Observable, of, tap } from 'rxjs';

/**
 * Formatea un Date al formato DD/MM/YYYY que espera la API.
 * Angular/JSON.stringify serializa los Date como ISO 8601 (toISOString()) por defecto,
 * lo que el backend rechaza con 400 Bad Request, así que convertimos explícitamente
 * antes de enviar la petición.
 */
function formatFechaApi(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

/** Payload real que viaja por HTTP: mismas propiedades que CreateConvocatoriaRequest,
 * salvo que las fechas van como string con el formato que espera el backend. */
type CreateConvocatoriaPayload = Omit<CreateConvocatoriaRequest, 'fechaInicio' | 'fechaFin'> & {
  fechaInicio: string;
  fechaFin: string;
};

@Injectable({ providedIn: 'root' })
//
export class ConvocatoriasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Convocatorias`;

  //Estado reactivo con Signals
  private convocatoriasSignal = signal<Convocatoria[]>([]);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  //Getters públicos
  get convocatorias() {
    return this.convocatoriasSignal.asReadonly();
  }

  get cargando() {
    return this.cargandoSignal.asReadonly();
  }
  get error() {
    return this.errorSignal.asReadonly();
  }

  //metodos de api
  obtenerConvocatorias(): Observable<Convocatoria[]> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Convocatoria[]>(this.apiUrl).pipe(
      tap((response) => {
        console.log('Respuesta de la API:', response);
        console.log('Es array?', Array.isArray(response));
        console.log('Cantidad de registros:', response?.length);
      }),
      map((response) => {
        return response || []; // Si es array, devolverlo; si no, array vacío
      }),
      tap((data) => {
        console.log('Datos finales:', data);
        console.log('Cantidad de registros:', data.length);
        this.convocatoriasSignal.set(data);
        this.cargandoSignal.set(false);
      }),
      catchError((error) => {
        console.error('Error:', error);
        this.errorSignal.set(error.message || 'Error al cargar los datos');
        this.cargandoSignal.set(false);
        return of([]);
      }),
    );
  }

  // Obtener una convocatoria por ID
  obtenerConvocatoriaId(id: string): Observable<Convocatoria | null> {
    return this.http.get<Convocatoria>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al obtener convocatoria');
        return of(null); // Retorna un observable con null en caso de error
      }),
    );
  }

  // Crear nueva convocatoria
  crearConvocatoria(data: CreateConvocatoriaRequest): Observable<CreateConvocatoriaRequest | null> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    const payload: CreateConvocatoriaPayload = {
      ...data,
      fechaInicio: formatFechaApi(data.fechaInicio),
      fechaFin: formatFechaApi(data.fechaFin),
    };

    console.log('Enviando datos:', payload);

    return this.http.post<CreateConvocatoriaRequest>(this.apiUrl, payload).pipe(
      tap((response) => {
        console.log('Convocatoria creada:', response);
        this.cargandoSignal.set(false);
      }),
      catchError((error) => {
        console.error('Error al crear convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al crear convocatoria');
        this.cargandoSignal.set(false);
        return of(null);
      }),
    );
  }

  // Actualizar convocatoria
  actualizarConvocatoria(
    id: string,
    data: UpdateConvocatoriaRequest,
  ): Observable<Convocatoria | null> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<Convocatoria>(`${this.apiUrl}/${id}`, data).pipe(
      tap((response) => {
        console.log('Convocatoria actualizada:', response);
        this.cargandoSignal.set(false);
      }),
      catchError((error) => {
        console.error('Error al actualizar convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al actualizar convocatoria');
        this.cargandoSignal.set(false);
        return of(null);
      }),
    );
  }

  eliminarConvocatoria(request: EliminarConvocatoriaRequest): Observable<boolean> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    // Construir URL con path para claveConvocatoria
    const url = `${this.apiUrl}/${request.claveConvocatoria}`;

    const params = new HttpParams().set('nombreUsuario', request.nombreUsuario);

    console.log(`Eliminando convocatoria: ${url}?nombreUsuario=${request.nombreUsuario}`);

    return this.http.delete<void>(url, { params }).pipe(
      map(() => {
        console.log('Convocatoria eliminada:', request.claveConvocatoria);
        this.convocatoriasSignal.update((lista) =>
          lista.filter((c) => c.claveConvocatoria !== request.claveConvocatoria),
        );
        this.cargandoSignal.set(false);
        return true; // Retorna true si la eliminación fue exitosa
      }),
      catchError((error) => {
        console.error('Error al eliminar convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al eliminar convocatoria');
        this.cargandoSignal.set(false);
        return of(false); // Retorna un observable con false en caso de error
      }),
    );
  }

  //Limpiar errores
  limpiarError(): void {
    this.errorSignal.set(null);
  }
}
