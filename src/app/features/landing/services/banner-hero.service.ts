// src/app/features/landing/services/banner-hero.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Publicacion } from '../models/publicacion.model'; // <-- Cambiado al nuevo modelo oficial
import { GaleriaImagen } from '../models/galeria.model';

@Injectable({
  providedIn: 'root',
})
export class BannerHeroService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene las publicaciones activas para el Banner Principal
   */
  obtenerBanners(): Observable<Publicacion[]> {
    const url = `${environment.apiUrl}/Publicaciones`;

    return this.http.get<Publicacion[]>(url);
  }

  obtenerImagenes(): Observable<GaleriaImagen[]> {
    const url = `${environment.apiUrl}/GaleriaImagenes`;
    return this.http.get<GaleriaImagen[]>(url);
  }
}
