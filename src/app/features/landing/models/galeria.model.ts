export interface GaleriaElemento {
  claveGaleria: number;
  rutaImagenUrl: string;
  tituloEvento: string;
  fechaRegistro?: string; // El '?' significa: "Puede venir o no del JSON"
  estaActivo?: boolean; // El '?' evita que TypeScript se queje por tu JSON
}
