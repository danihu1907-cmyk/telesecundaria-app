import { Injectable, signal } from '@angular/core';
import { Aspirante } from '../models/aspirante.model';

@Injectable({ providedIn: 'root' })
export class AspirantesService {
  private _aspirantes = signal<Aspirante[]>([
    {
      id: '1',
      nombre: 'Ximena Nieves Carpenter',
      clave: 'XINIHD00987304',
      estatus: 'documentos-incompletos',
      documentosSubidos: 3,
      documentosTotales: 4,
      documentos: [
        { id: 'acta', nombre: 'Acta de nacimiento', estado: 'subido' },
        { id: 'curp', nombre: 'CURP', estado: 'subido' },
        { id: 'certificado', nombre: 'Certificado de primaria', estado: 'subido' },
        { id: 'comprobante', nombre: 'Comprobante de domicilio', estado: 'pendiente' },
      ],
    },
  ]);

  readonly aspirantes = this._aspirantes.asReadonly();

  agregar(aspirante: Aspirante): void {
    this._aspirantes.update((list) => [...list, aspirante]);
  }

  actualizar(id: string, cambios: Partial<Aspirante>): void {
    this._aspirantes.update((list) => list.map((a) => (a.id === id ? { ...a, ...cambios } : a)));
  }

  obtenerPorId(id: string): Aspirante | undefined {
    return this._aspirantes().find((a) => a.id === id);
  }
}
