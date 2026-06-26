export type Convocatoria = {
  claveConvocatoria: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoConvocatoria;
  cicloEscolar: string;
  cupoMaximo: number;
};

export type EstadoConvocatoria = 'Activa' | 'Cerrada' | 'En Pausa';

export const ESTADO_COLORS: Record<EstadoConvocatoria, { bg: string; text: string }> = {
  Activa: {
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
  },
  Cerrada: {
    bg: 'bg-red-100 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
  },
  'En Pausa': {
    bg: 'bg-yellow-100 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
};

export type OrdenarTablas =
  | 'titulo'
  | 'descripcion'
  | 'Fecha de Inicio'
  | 'Fecha de Fin'
  | 'Ciclo Escolar'
  | 'Cupo Máximo';

// Creacion de datos de prueba para las convocatorias
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const ESTADOS: EstadoConvocatoria[] = ['Activa', 'Cerrada', 'En Pausa'];

export function getRandomEstado(): EstadoConvocatoria {
  const randomIndex = Math.floor(Math.random() * ESTADOS.length);
  return ESTADOS[randomIndex];
}

export const DATA_CONVOCATORIAS: Convocatoria[] = Array.from({ length: 100 }, (_, index) => {
  const anioInicio = 2015 + Math.floor(Math.random() * 12);
  const anioFin = anioInicio + 1;

  return {
    claveConvocatoria: `CONV-${String(index + 1).padStart(3, '0')}`,
    titulo: `Convocatoria para el ciclo escolar ${anioInicio}-${anioFin}`,
    descripcion: `Proceso de admisión correspondiente al ciclo escolar ${anioInicio}-${anioFin}.`,
    fechaInicio: randomDate(new Date(anioInicio, 0, 1), new Date(anioInicio, 10, 30)),
    fechaFin: randomDate(new Date(anioInicio, 11, 1), new Date(anioFin, 6, 31)),
    cicloEscolar: `${anioInicio}-${anioFin}`,
    cupoMaximo: Math.floor(Math.random() * 200) + 50,
    estado: ESTADOS[Math.floor(Math.random() * ESTADOS.length)],
  };
});
