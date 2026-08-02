import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type { Aspirantes } from '../models/aspirantes.models';
import { catchError, map, Observable, of, tap } from 'rxjs';

/**
 * Formatea un Date al formato DD/MM/YYYY que espera la API.
 * Angular/JSON.stringify serializa los Date como ISO 8601 (toISOString()) por defecto,
 * lo que el backend rechaza con 400 Bad Request, así que convertimos explícitamente
 * antes de enviar la petición.
 */
// function formatFechaApi(fecha: Date): string {
//   const dia = String(fecha.getDate()).padStart(2, '0');
//   const mes = String(fecha.getMonth() + 1).padStart(2, '0');
//   const anio = fecha.getFullYear();
//   return `${dia}/${mes}/${anio}`;
// }

/** Payload real que viaja por HTTP: mismas propiedades que CreateAspiranteRequest,
 * salvo que las fechas van como string con el formato que espera el backend. */
// type CreateAspirantePayload = Omit<CreateAspiranteRequest, 'fechaRegistro' | 'fechaLimite'> & {
//   fechaRegistro: string;
//   fechaLimite: string;
// };

@Injectable({ providedIn: 'root' })
export class AspirantesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Aspirantes`;

  //Estado reactivo con Signals
  private aspirantesSignal = signal<Aspirantes[]>([]);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  //Getters públicos
  get aspirantes() {
    return this.aspirantesSignal.asReadonly();
  }

  get cargando() {
    return this.cargandoSignal.asReadonly();
  }
  get error() {
    return this.errorSignal.asReadonly();
  }

  //metodos de api
  obtenerAspirantes(): Observable<Aspirantes[]> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Aspirantes[]>(this.apiUrl).pipe(
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
        this.aspirantesSignal.set(data);
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

  // Obtener un aspirante por ID
  obtenerAspiranteId(id: string): Observable<Aspirantes | null> {
    return this.http.get<Aspirantes>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener aspirante:', error);
        this.errorSignal.set(error.message || 'Error al obtener aspirante');
        return of(null); // Retorna un observable con null en caso de error
      }),
    );
  }

  //Limpiar errores
  limpiarError(): void {
    this.errorSignal.set(null);
  }
}
