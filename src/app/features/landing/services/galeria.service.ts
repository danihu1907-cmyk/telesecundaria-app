import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GaleriaImagen } from '../models/galeria.model';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene las imágenes activas para la sección de Galería
   */
  obtenerImagenes(): Observable<GaleriaImagen[]> {
    const url = `${environment.apiUrl}/GaleriaImagenes`;

    return this.http.get<GaleriaImagen[]>(url);
  }
}
