import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type {
  Convocatoria,
  CreateConvocatoriaRequest,
  UpdateConvocatoriaRequest,
} from '../models/convocatorias.models';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
//
export class ConvocatoriasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Convocatorias`;

  //Estado reactivo con Signals
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  //Getters públicos
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
  crearConvocatoria(data: CreateConvocatoriaRequest): Observable<Convocatoria | null> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    console.log('Enviando datos:', data);

    return this.http.post<Convocatoria>(this.apiUrl, data).pipe(
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
        console.log('✅ Convocatoria actualizada:', response);
        this.cargandoSignal.set(false);
      }),
      catchError((error) => {
        console.error('❌ Error al actualizar convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al actualizar convocatoria');
        this.cargandoSignal.set(false);
        return of(null);
      }),
    );
  }

  // Eliminar convocatoria
  eliminarConvocatoria(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al eliminar convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al eliminar convocatoria');
        return of(false); // Retorna un observable con false en caso de error
      }),
    );
  }

  //Limpiar errores
  limpiarError(): void {
    this.errorSignal.set(null);
  }
}
