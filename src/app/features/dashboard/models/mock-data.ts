import { Convocatoria, EstadoConvocatoria } from './convocatorias.models';

const estados: EstadoConvocatoria[] = ['Activa', 'Cerrada', 'En Pausa'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
    estado: estados[Math.floor(Math.random() * estados.length)],
  };
});
