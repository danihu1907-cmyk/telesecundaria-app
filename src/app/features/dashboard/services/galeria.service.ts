import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import type { ImagenGaleria } from '../models/galeria.models';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/GaleriaImagenes`;

  // ✅ Estado reactivo con Signals
  private imagenesSignal = signal<ImagenGaleria[]>([]);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // ✅ Getters públicos
  get imagenes() {
    return this.imagenesSignal.asReadonly();
  }

  get cargando() {
    return this.cargandoSignal.asReadonly();
  }

  get error() {
    return this.errorSignal.asReadonly();
  }

  // ✅ Obtener todas las imágenes
  obtenerImagenes(): Observable<ImagenGaleria[]> {
    console.log('Llamando a obtenerImagenes()');
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<ImagenGaleria[]>(this.apiUrl).pipe(
      tap((response) => {
        console.log('Imágenes recibidas:', response?.length);
        this.imagenesSignal.set(response || []);
        this.cargandoSignal.set(false);
      }),
      map((response) => response || []),
      catchError((err) => {
        console.error('Error al cargar imágenes:', err);
        this.errorSignal.set(err.message || 'Error al cargar las imágenes');
        this.cargandoSignal.set(false);
        return of([]);
      }),
    );
  }

  // ✅ Obtener una imagen por ID
  obtenerImagenPorId(claveImagen: string): Observable<ImagenGaleria | null> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<ImagenGaleria>(`${this.apiUrl}/${claveImagen}`).pipe(
      tap(() => this.cargandoSignal.set(false)),
      catchError((err) => {
        console.error('Error al obtener imagen:', err);
        this.errorSignal.set(err.message || 'Error al obtener la imagen');
        this.cargandoSignal.set(false);
        return of(null);
      }),
    );
  }

  //Limpiar errores
  limpiarError(): void {
    this.errorSignal.set(null);
  }
}
