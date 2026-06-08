import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, delay, tap } from 'rxjs';
import {
  RegistroTutorRequest,
  AuthResponse,
  LoginRequest,
  RecuperarPasswordRequest,
} from '../../features/auth/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthTutorService {
  // VARIABLES DE SESIÓN REACTIVAS EN MEMORIA RAM (SIGNALS)
  private sesionActivaSignal = signal<boolean>(false);
  private tokenSignal = signal<string | null>(null);

  // NUEVO SIGNAL: SIMULA SI LA CONVOCATORIA ESCOLAR ESTÁ ACTIVA (TRUE) O CERRADA (FALSE)
  // MODIFICADO EN MAYÚSCULAS: CAMBIA ESTE VALOR A 'FALSE' PARA EVALUAR CÓMO EL GUARD EXPULSA USUARIOS
  private convocatoriaActivaSignal = signal<boolean>(true);

  // EXPUESTAS A LECTURA EXCLUSIVA PARA EL RESTO DE LA APP (GUARDS Y COMPONENTES)
  public sesionActiva = this.sesionActivaSignal.asReadonly();
  public tokenActual = this.tokenSignal.asReadonly();
  public convocatoriaActiva = this.convocatoriaActivaSignal.asReadonly();

  constructor(private http: HttpClient) {
    // AL ARRANCAR EL SERVICIO, LEEMOS EL DISCO UNA SOLA VEZ PARA REANUDAR SESIÓN SI EXISTE
    const tokenGuardado = localStorage.getItem('token_control_escolar');
    if (tokenGuardado) {
      this.tokenSignal.set(tokenGuardado);
      this.sesionActivaSignal.set(true);
    }
  }

  // MÉTODOS DE GESTIÓN COMBINADA (RAM + DISCO) PARA INTERCEPTORES Y GUARDS
  private establecerSesion(token: string): void {
    localStorage.setItem('token_control_escolar', token);
    this.tokenSignal.set(token);
    this.sesionActivaSignal.set(true);
  }

  public cerrarSesion(): void {
    localStorage.removeItem('token_control_escolar');
    this.tokenSignal.set(null);
    this.sesionActivaSignal.set(false);
  }

  // MÉTODO PARA ACTUALIZAR EL ESTADO DE LA CONVOCATORIA DINÁMICAMENTE DESDE LA SIMULACIÓN
  public establecerEstadoConvocatoria(estado: boolean): void {
    this.convocatoriaActivaSignal.set(estado);
  }

  // =========================================================================
  // VERSION 1: ESCENARIO ACTIVO CON MOCKING (SIMULACION EN MEMORIA CON VALIDACIONES)
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

  login(payload: LoginRequest): Observable<AuthResponse> {
    console.log('EJECUTANDO SIMULACION DE LOGIN / VERIFICACION DE CREDENCIALES');
    console.log('DATOS RECIBIDOS EN SERVICIO:', payload);

    if (
      payload.correo.toLowerCase().trim() === 'tutor@gmail.com' &&
      payload.contrasena === 'Temporal123'
    ) {
      const tokenSimulado = 'TOKEN_SIMULADO_PADRE_VALIDEZ_2026';
      this.establecerSesion(tokenSimulado);

      return of({
        success: true,
        message: 'AUTENTICACIÓN EXITOSA. BIENVENIDO AL SISTEMA.',
        token: tokenSimulado,
      }).pipe(delay(1200));
    }

    return throwError(() => new Error('EL CORREO ELECTRÓNICO O LA CONTRASEÑA SON INCORRECTOS.'));
  }

  recuperarContrasena(payload: RecuperarPasswordRequest): Observable<AuthResponse> {
    console.log('EJECUTANDO SIMULACION DE GENERACIÓN DE TOKEN DE RECUPERACIÓN');
    console.log('CORREO SOLICITANTE:', payload.correo);

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
=========================================================================

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { RegistroTutorRequest, AuthResponse, LoginRequest, RecuperarPasswordRequest } from '../../features/auth/models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthTutorService { 
  private sesionActivaSignal = signal<boolean>(false);
  private tokenSignal = signal<string | null>(null);
  
  // MODIFICADO EN MAYÚSCULAS: INTEGRACIÓN DE VARIABLE DE CONVOCATORIA PARA PETICIÓN REAL
  private convocatoriaActivaSignal = signal<boolean>(true);

  public sesionActiva = this.sesionActivaSignal.asReadonly();
  public tokenActual = this.tokenSignal.asReadonly();
  public convocatoriaActiva = this.convocatoriaActivaSignal.asReadonly();

  constructor(private http: HttpClient) {
    const tokenGuardado = localStorage.getItem('token_control_escolar');
    if (tokenGuardado) {
      this.tokenSignal.set(tokenGuardado);
      this.sesionActivaSignal.set(true);
    }
  }

  private establecerSesion(token: string): void {
    localStorage.setItem('token_control_escolar', token);
    this.tokenSignal.set(token);
    this.sesionActivaSignal.set(true);
  }

  public cerrarSesion(): void {
    localStorage.removeItem('token_control_escolar');
    this.tokenSignal.set(null);
    this.sesionActivaSignal.set(false);
  }

  // MODIFICADO EN MAYÚSCULAS: MÉTODO REAL DE CONTROL DE APERTURA DESDE EL BACKEND
  verificarConvocatoriaServidor(): Observable<boolean> {
    const url = environment.production
      ? `${environment.apiUrl}/api/convocatoria/estado-actual`
      : `http://localhost:3000/api/convocatoria/estado-actual`;

    return this.http.get<boolean>(url).pipe(
      tap(activa => this.convocatoriaActivaSignal.set(activa))
    );
  }

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

    return this.http.post<AuthResponse>(url, payload).pipe(
      tap(res => {
        if (res && res.token) {
          this.establecerSesion(res.token);
        }
      })
    );
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
