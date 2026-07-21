export interface LoginRequest {
  correo: string;
  contrasenia: string; // EN EL LOGIN TU API PIDE CONTRASENIA CON ENYE
}

export interface RegistroTutorRequest {
  // DATOS PERSONALES Y DE ACCESO
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  curpTutor: string;
  telefono: string;
  parentesco: string;
  correo: string;
  contrasena: string;
  // DATOS DEL DOMICILIO
  calleNumero: string;
  colonia: string;
  codigoPostal: string;
  municipio: string;
}

export interface RecuperarPasswordRequest {
  correo: string;
}

export interface AuthResponse {
  token: string;
  claveToken: string;
  claveTutorAspirante: string;
  nombreTutor: string;
  mensaje: string;
}

export interface RegistroTutorResponse {
  claveTutorAspirante: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  curpTutor: string;
  telefono: string;
  correo: string;
  parentesco: string;
  estado: boolean;
}
