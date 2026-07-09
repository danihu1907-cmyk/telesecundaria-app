import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConvocatoriasService {
  //   constructor(private http: HttpClient) {}

  private http = inject(HttpClient);
  obtenerConvocatorias() {
    this.http.get('https://telesecundaria.com/api/Convocatorias');
  }
}
