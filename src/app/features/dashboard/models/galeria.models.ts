export type ImagenGaleria = {
  claveImagen: string;
  nombreArchivo: string;
  rutaUrl: string;
  tipoRecurso: tipoRecursoConvocatoria;
  fechaRegistro: string;
};

export type tipoRecursoConvocatoria =
  | 'Eventos Culturales'
  | 'Noticia'
  | 'Aviso'
  | 'Convocatoria'
  | 'Otro';
