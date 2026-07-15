import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type { Convocatoria, ApiResponse } from '../models/convocatorias.models';
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
  crearConvocatoria(data: Partial<Convocatoria>): Observable<Convocatoria | null> {
    return this.http.post<Convocatoria>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error al crear convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al crear convocatoria');
        return of(null); // Retorna un observable con null en caso de error
      }),
    );
  }

  // Actualizar convocatoria
  actualizarConvocatoria(id: string, data: Partial<Convocatoria>): Observable<Convocatoria | null> {
    return this.http.put<Convocatoria>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error al actualizar convocatoria:', error);
        this.errorSignal.set(error.message || 'Error al actualizar convocatoria');
        return of(null); // Retorna un observable con null en caso de error
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
