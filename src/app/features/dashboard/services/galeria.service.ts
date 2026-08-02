import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import type { EliminarImagenRequest, ImagenGaleria } from '../models/galeria.models';

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

  eliminarImagen(request: EliminarImagenRequest): Observable<boolean> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    // Construir URL con path para claveConvocatoria
    const url = `${this.apiUrl}/${request.claveImagen}`;

    const params = new HttpParams().set('nombreUsuario', request.claveImagen);

    console.log(`Eliminando convocatoria: ${url}?nombreUsuario=${request.claveImagen}`);

    return this.http.delete<void>(url, { params }).pipe(
      map(() => {
        console.log('Galeria eliminada:', request.claveImagen);
        this.imagenesSignal.update((lista) =>
          lista.filter((c) => c.claveImagen !== request.claveImagen),
        );
        this.cargandoSignal.set(false);
        return true; // Retorna true si la eliminación fue exitosa
      }),
      catchError((error) => {
        console.error('Error al eliminar la imagen:', error);
        this.errorSignal.set(error.message || 'Error al eliminar la imagen');
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
