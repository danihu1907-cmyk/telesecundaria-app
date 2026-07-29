export type Convocatoria = {
  claveConvocatoria: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoConvocatoria;
  cicloEscolar: string;
  cupoMaximo: number;
  cupoDisponible?: number;
  activacion: boolean;
  fechaRegistro: Date;
};

// Request para crear/actualizar
export interface CreateConvocatoriaRequest {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  cicloEscolar: string;
  cupoMaximo: number;
  nombreUsuario: string;
  claveImagen: string;
}

export interface UpdateConvocatoriaRequest {
  claveConvocatoria: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  cupoMaximo: number;
  nombreUsuario: string;
  claveImagen: string;
  destacadoTexto: string;
}

export interface EliminarConvocatoriaRequest {
  claveConvocatoria: string;
  nombreUsuario: 'admin' | string; // O el usuario actual
}

export type EstadoConvocatoria = 'Publicada' | 'Cerrada' | 'Programada';

export const ESTADO_COLORS: Record<EstadoConvocatoria, { bg: string; text: string }> = {
  Publicada: {
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
  },
  Cerrada: {
    bg: 'bg-red-100 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
  },
  Programada: {
    bg: 'bg-yellow-100 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
};
