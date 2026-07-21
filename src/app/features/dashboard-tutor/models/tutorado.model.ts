// ============================================================================
// 1. REGISTRO DE ASPIRANTES (PASO 1) - Modelos Reales de tu API /Aspirantes
// ============================================================================

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

// ============================================================================
// 2. CONTROL DE ADJUNCIONES (PASO 2) - Modelos Dinámicos Basados en Swagger
// ============================================================================

export interface TipoDocumento {
  claveTipoDocumento: string;
  nombreDocumento: string;
  area: 'Preinscripción' | 'Inscripción' | 'Laboral' | string;
  descripcion: string;
  estado: boolean;
}

export interface DocumentoCargado {
  claveDocAspirante: string;
  tipoDocumento: string;
  rutaUrl: string;
  estatus?: 'Pendiente' | 'Aceptado' | 'Rechazado';
  descripcion?: string;
  motivoRechazo?: string | null;
}

export interface EstadoAdjuncion {
  claveAspirante: string;
  documentosCargados: DocumentoCargado[];
  todosCompletos: boolean;
}

export interface AdjuncionResponse {
  claveAdjuncion: string;
  claveTutor: string;
  claveAspirante: string;
  estatusGral: string;
  documentos: DocumentoCargado[];
}
export interface FinalizarAdjuncionRequest {
  ClaveTutor: string;
  ClaveAspirante: string;
}

export interface TarjetaDocumento {
  claveTipoDocumento: string; // Viene de TipoDocumento.claveTipoDocumento (Ej: "TIPO-0004")
  nombreDocumento: string; // Viene de TipoDocumento.nombreDocumento (Ej: "CURP")
  descripcion: string; // Viene de TipoDocumento.descripcion
  archivoSeleccionado: File | null; // El archivo físico seleccionado en el input (temporal en RAM)
  cargadoEnServidor: boolean; // TRUE si ya existe en el estado del alumno. Pinta "Listo ✓"
}

// ============================================================================
// 3. DASHBOARD / OVERVIEW DEL TUTOR (PANTALLAS 6 Y 7) - Modelos Reales
// ============================================================================

export interface AspiranteTarjetaDashboard {
  claveAspirante: string;
  nombreCompleto: string; // Se construye en el servicio concatenando los tres campos
  estatusTramite: string; // Viene de estatusAspirante del API
  porcentajeProgreso: number;
  tieneDocumentosRechazados?: boolean;
}

export interface DashboardTutorResponse {
  nombreTutor: string; // Lo obtenemos del LocalStorage después del login
  aspirantes: AspiranteTarjetaDashboard[];
}
