/* export interface Aspirante {
  id: string;
  nombreCompleto: string;
  curp: string;
  estadoDocumental: 'pendiente' | 'aceptada'; // Tipado estricto basado en tus chips CSS
  progresoPorcentaje: number; // Para la barra de progreso (ej. 75)
  documentosSubidos: number; // Ej: 3
  documentosTotales: number; // Ej: 4
}

export interface DocumentoRequerido {
  id: string;
  nombre: string;
  formatoMime: string;
  tamanoMaximo: string;
  subido: boolean;
  progresoSubida: number; // Para la barra de carga individual (0 a 100)
}
 */

export type DocumentoEstado = 'subido' | 'lista' | 'pendiente';

export interface Documento {
  id: string;
  nombre: string;
  estado: DocumentoEstado;
  archivo?: File;
  url?: string;
}

export type AspiranteEstatus = 'documentos-incompletos' | 'completo' | 'en-revision';

export interface Aspirante {
  id: string;
  nombre: string;
  clave: string;
  estatus: AspiranteEstatus;
  documentosSubidos: number;
  documentosTotales: number;
  documentos: Documento[];
}
