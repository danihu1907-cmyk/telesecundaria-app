export interface LoginRequest {
  correo: string;
  contrasenia: string; // BIEN - ASI LO PIDE EL API
}

export interface RegistroTutorRequest {
  // DATOS PERSONALES Y DE ACCESO
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  curp_tutor: string;
  telefono: string;
  parentesco: string;
  correo: string;
  contrasena: string;

  // DATOS DEL DOMICILIO
  calle_numero: string;
  colonia: string;
  codigo_postal: string;
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

/* LO NUEVO PARA CONSUMIR */
