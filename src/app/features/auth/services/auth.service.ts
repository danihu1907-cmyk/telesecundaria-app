/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // SE IDENTIFICA EL CLIENTE PARA EL FUTURO REAL
import { Observable, of, throwError, delay } from 'rxjs';
import {
  RegistroTutorRequest,
  AuthResponse,
  LoginRequest,
  RecuperarPasswordRequest,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // =========================================================================
  // VERSION 1: ESCENARIO ACTIVO CON MOCKING (SIMULACION EN MEMORIA CON VALIDACIONES)
  // EN ESTA VERSION NO SE USA EL ENVIRONMENT PORQUE NO HACEMOS PETICIONES HTTP
  // =========================================================================

  private curpsRegistradasMock: string[] = ['PERM801010HDFXRR01'];
  private correosRegistradosMock: string[] = ['tutor@gmail.com'];

  verificarCurpUnica(curp: string): Observable<boolean> {
    const existe = this.curpsRegistradasMock.includes(curp.toUpperCase().trim());
    return of(existe).pipe(delay(500));
  }

  registrarTutorCompleto(payload: RegistroTutorRequest): Observable<AuthResponse> {
    console.log('EJECUTANDO SIMULACION DE SP_INSERTAR_TUTOR_CON_DIRECCION');
    console.log('OBJETO UNIFICADO RECIBIDO EN EL SERVICIO:', payload);

    if (this.curpsRegistradasMock.includes(payload.curp_tutor.toUpperCase().trim())) {
      return throwError(
        () => new Error(`LA CURP ${payload.curp_tutor} YA SE ENCUENTRA REGISTRADA EN EL SISTEMA`),
      );
    }

    if (this.correosRegistradosMock.includes(payload.correo.toLowerCase().trim())) {
      return throwError(
        () => new Error(`EL CORREO ${payload.correo} YA ESTA ASOCIADO A OTRA CUENTA DE ASPIRANTE`),
      );
    }

    return of({
      success: true,
      message: `REGISTRO COMPLETADO EXITOSAMENTE. SE CREO EL ACCESO PARA EL CORREO ${payload.correo}`,
      token: 'TOKEN_SIMULADO_DE_CONVOCATORIA_XYZ123',
    }).pipe(delay(1500));
  }

  //  NUEVO MÉTODO: SIMULACIÓN DE INICIO DE SESIÓN (SP_INICIAR_SESION)
  login(payload: LoginRequest): Observable<AuthResponse> {
    console.log('EJECUTANDO SIMULACION DE LOGIN / VERIFICACION DE CREDENCIALES');
    console.log('DATOS RECIBIDOS EN SERVICIO:', payload);

    // Validación simulada usando el correo de prueba que ya declaraste arriba
    if (
      payload.correo.toLowerCase().trim() === 'tutor@gmail.com' &&
      payload.contrasena === 'Temporal123'
    ) {
      return of({
        success: true,
        message: 'AUTENTICACIÓN EXITOSA. BIENVENIDO AL SISTEMA.',
        token: 'TOKEN_SIMULADO_PADRE_VALIDEZ_2026',
      }).pipe(delay(1200));
    }

    // Si las credenciales no coinciden con el mock, dispara un error exacto tipo API
    return throwError(() => new Error('EL CORREO ELECTRÓNICO O LA CONTRASEÑA SON INCORRECTOS.'));
  }

  //  NUEVO MÉTODO: SIMULACIÓN DE RECUPERACIÓN DE CONTRASEÑA
  recuperarContrasena(payload: RecuperarPasswordRequest): Observable<AuthResponse> {
    console.log('EJECUTANDO SIMULACION DE GENERACIÓN DE TOKEN DE RECUPERACIÓN');
    console.log('CORREO SOLICITANTE:', payload.correo);

    // Simulamos que si el correo no está registrado, avisa al usuario
    if (!this.correosRegistradosMock.includes(payload.correo.toLowerCase().trim())) {
      return throwError(
        () =>
          new Error(`EL CORREO ${payload.correo} NO SE ENCUENTRA REGISTRADO EN NUESTRO SISTEMA.`),
      );
    }

    return of({
      success: true,
      message: `SE HA ENVIADO UN CORREO ELECTRÓNICO CON LAS INSTRUCCIONES A ${payload.correo}`,
    }).pipe(delay(1000));
  }
}

/* =========================================================================
VERSION 2: ESCENARIO REAL CON SERVIDOR (COMENTADO POR BLOQUE)
INSTRUCCIONES DE USO FUTURO:
1. ELIMINAR O COMENTAR TODA LA VERSION 1 DE ARRIBA
2. DESCOMENTAR ESTE BLOQUE COMPLETAMENTE PARA EMPEZAR A PEGAR A TU BASE DE DATOS
=========================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // AQUÍ SÍ ES OBLIGATORIO PORQUE SE USA EN LAS CONSTANTES URL
import { RegistroTutorRequest, AuthResponse, LoginRequest, RecuperarPasswordRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  verificarCurpUnica(curp: string): Observable<boolean> {
    const url = environment.production
      ? `${environment.apiUrl}/api/auth/validar-curp/${curp}`
      : `http://localhost:3000/api/auth/validar-curp/${curp}`; 

    return this.http.get<boolean>(url);
  }

  registrarTutorCompleto(payload: RegistroTutorRequest): Observable<AuthResponse> {
    const url = environment.production
      ? `${environment.apiUrl}/api/auth/registro-tutor`
      : `http://localhost:3000/api/auth/registro-tutor`; 

    return this.http.post<AuthResponse>(url, payload);
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    const url = environment.production
      ? `${environment.apiUrl}/api/auth/login`
      : `http://localhost:3000/api/auth/login`; 

    return this.http.post<AuthResponse>(url, payload);
  }

  recuperarContrasena(payload: RecuperarPasswordRequest): Observable<AuthResponse> {
    const url = environment.production
      ? `${environment.apiUrl}/api/auth/recuperar-contrasena`
      : `http://localhost:3000/api/auth/recuperar-contrasena`; 

    return this.http.post<AuthResponse>(url, payload);
  }
}
=========================================================================
*/
