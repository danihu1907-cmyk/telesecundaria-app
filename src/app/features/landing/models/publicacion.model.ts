export interface Publicacion {
  clavePublicacion: string;
  titulo: string;
  subtitulo: string;
  cuerpoContenido: string;
  categoria: string;
  fechaAparicion: string;
  fechaRetiro?: string | null;
  claveUsuario: string;
  claveConvocatoria: string;
  claveImagenPrincipal?: string | null;
  claveImagenSecundaria?: string | null;
  claveImagenTercera?: string | null;
  fechaRegistro: string;
  destacado: boolean;
  estatusVisible: boolean;
}
