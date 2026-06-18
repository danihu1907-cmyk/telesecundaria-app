/*2 */
/*MODELO PERFECTO*/
// ============================================================================
// 1. PASO 1: DATOS PERSONALES DEL ASPIRANTE (FORMULARIO POST)
// ============================================================================

/**
 * Contrato exacto para enviar los datos del formulario del Paso 1 al servidor.
 */
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
 * Respuesta que te devuelve el servidor tras crear con éxito al aspirante.
 */
export interface RegistrarAspiranteResponse {
  success: boolean;
  message: string;
  claveAspirante: string; // ¡La llave de oro! (Ej: "ASP-2026-001")
}

// ============================================================================
// 2. PASO 2: ADJUNCIONES / DOCUMENTOS (MULTIPART FORM-DATA)
// ============================================================================

/**
 * Estructura de soporte para armar el FormData en el servicio.
 * string($binary) en Swagger se convierte en objetos tipo 'File' en Angular.
 */
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
  id_aspirante: number;
  claveAspirante: string;
  nombre_completo: string;
  estatus_tramite: 'Documentos incompletos' | 'En revisión' | 'Validado';
  porcentaje_progreso: number; // 50 (Paso 1 listo) o 100 (Paso 2 listo)
}

/**
 * Respuesta completa del servidor para armar el Dashboard del tutor.
 * El atributo 'aspirantes' es un arreglo que puede traer 0, 1 o más hijos.
 */
export interface DashboardTutorResponse {
  nombre_tutor: string;
  aspirantes: AspiranteTarjetaDashboard[];
}
