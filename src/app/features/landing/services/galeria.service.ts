import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GaleriaElemento } from '../models/galeria.model';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene las imágenes activas para la sección de Galería
   */
  obtenerImagenes(): Observable<GaleriaElemento[]> {
    // 1. En producción apuntamos al endpoint de la API en C#
    // 2. En desarrollo seguimos apuntando a tus datos simulados (JSON local en public)
    const url = environment.production
      ? `${environment.apiUrl}/Galeria`
      : 'mock-data/galeria.json';

    return this.http.get<GaleriaElemento[]>(url);
  }
}
