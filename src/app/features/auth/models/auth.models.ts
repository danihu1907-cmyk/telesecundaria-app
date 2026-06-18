export interface TutorAspirante {
  claveTutorAspirante?: string; // OPCIONAL PORQUE SE GENERA CON TU FUNCION DEFAULT EN SQL
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string; // OPCIONAL SIN NOT NULL EN TU SCRIPT
  curp_tutor: string;
  telefono: string;
  correo: string; // SE USA PARA EL INICIO DE SESION
  parentesco: string;
  contrasena: string; // SE GUARDARA ENCRIPTADA MEDIANTE EL SP
  estado?: boolean;
}

export interface DireccionTutor {
  calle_numero: string;
  colonia: string;
  codigo_postal: string;
  municipio: string;
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

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RecuperarPasswordRequest {
  correo: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  claveTutorAspirante?: string; // <--- ¡ AGREGA ESTA LÍNEA AQUÍ !
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}
