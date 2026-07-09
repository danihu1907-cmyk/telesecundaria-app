export interface RegistrarAspiranteRequest {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  escuelaProcedencia: string;
  promedioPrimaria: number;
  discapacidadTexto: string;
  nombreEnfermedad: string;
  hermanoTexto: string;
  curpHermano: string;
  claveTutorAspirante: string; // Se recupera desde el módulo de Auth
}

/**
 * Estructura exacta que devuelve el GET /api/Aspirantes
 */
export interface Aspirante {
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
  estatusAspirante: string;
  claveConvocatoria: string;
  claveTutorAspirante: string;
  estado: boolean;
}
export interface RegistrarAspiranteResponse {
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
  estatusAspirante: string;
  claveConvocatoria: string;
  claveTutorAspirante: string;
  estado: boolean;
}
export interface RegistrarAdjuncionesRequest {
  ClaveTutor: string;
  ClaveAspirante: string;
  ActaNacimiento: File;
  Curp: File;
  ComprobanteDomicilio: File;
  CertificadoPrimaria: File;
  ConstanciaEstudios?: File; // Opcional en tu flujo
}

/**
 * Modelo exclusivo para el control visual dentro de la memoria RAM del componente.
 * Sirve para saber qué archivo seleccionó el usuario y pintar los botones en verde.
 */
export interface ControlArchivoVista {
  llaveFormulario:
    | 'ActaNacimiento'
    | 'Curp'
    | 'ComprobanteDomicilio'
    | 'CertificadoPrimaria'
    | 'ConstanciaEstudios';
  nombreEtiqueta: string; // Ej: "Acta de Nacimiento"
  archivoSeleccionado: File | null; // El archivo físico en la RAM
  esObligatorio: boolean;
}

// ============================================================================
// 3. DASHBOARD / OVERVIEW DEL TUTOR (PANTALLAS 6 Y 7)
// ============================================================================

/**
 * Datos individuales de cada hijo registrado para pintar sus tarjetas.
 */
export interface AspiranteTarjetaDashboard {
  claveAspirante: string;
  nombreCompleto: string; // LO CONSTRUIMOS EN EL SERVICIO CONCATENANDO LOS TRES CAMPOS
  estatusTramite: string; // VIENE DE estatusAspirante DEL API
  porcentajeProgreso: number; // SE CALCULA EN EL SERVICIO SEGUN EL ESTATUS
}

/**
 * Respuesta completa del servidor para armar el Dashboard del tutor.
 * El atributo 'aspirantes' es un arreglo que puede traer 0, 1 o más hijos.
 */
export interface DashboardTutorResponse {
  nombreTutor: string; // LO OBTENEMOS DEL LOCALSTORAGE DESPUES DEL LOGIN
  aspirantes: AspiranteTarjetaDashboard[];
}
