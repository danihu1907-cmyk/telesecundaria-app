export type Aspirantes = {
  claveAspirante: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  escuelaProcedencia: string;
  promedioPrimaria: number;
  tieneDiscapacidad: boolean;
  nombreEnfermedad: string | null;
  hermanoPlantel: boolean;
  curpHermano: string | null;
  estatusAspirante: Estatus;
  claveConvocatoria: string;
  claveTutorAspirante: string;
  estado: boolean;
};

export type Estatus = 'Aceptado' | 'En proceso' | 'Rechazado';

export const ESTADO_COLORS: Record<Estatus, { bg: string; text: string }> = {
  Aceptado: {
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
  },
  'En proceso': {
    bg: 'bg-yellow-100 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  Rechazado: {
    bg: 'bg-red-100 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
  },
};
