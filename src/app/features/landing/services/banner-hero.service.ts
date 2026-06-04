// src/app/features/landing/services/banner-hero.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Publicacion } from '../models/publicacion.model'; // <-- Cambiado al nuevo modelo oficial

@Injectable({
  providedIn: 'root',
})
export class BannerHeroService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene las publicaciones activas para el Banner Principal
   */
  obtenerBanners(): Observable<Publicacion[]> {
    // <-- Ahora retorna un arreglo de Publicaciones

    // 1. En producción apuntamos al endpoint exacto que vimos en Swagger: /api/Publicaciones
    // 2. En desarrollo seguimos apuntando a tus datos simulados (JSON local)
    const url = environment.production
      ? `${environment.apiUrl}/api/Publicaciones`
      : 'mock-data/banner-hero.json'; // Tu archivo local de pruebas (donde harcodeas las claves)

    return this.http.get<Publicacion[]>(url);
  }
}
