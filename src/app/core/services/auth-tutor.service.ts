import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
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
  // CORRECCIÓN: AHORA RECIBE TAMBIÉN EL NOMBRE DEL TUTOR PARA GUARDARLO EN DISCO
  private establecerSesion(token: string, claveTutorAspirante: string, nombreTutor: string): void {
    localStorage.setItem('token_control_escolar', token);
    localStorage.setItem('claveTutorAspirante', claveTutorAspirante);
    // LINEA AGREGADA: GUARDAMOS EL NOMBRE DEL TUTOR PARA QUE EL DASHBOARD PUEDA PINTAR LAS INICIALES
    localStorage.setItem('nombreTutor', nombreTutor);
    this.tokenSignal.set(token);
    this.sesionActivaSignal.set(true);
  }

  public cerrarSesion(): void {
    localStorage.removeItem('token_control_escolar');
    localStorage.removeItem('claveTutorAspirante');
    // LINEA AGREGADA: LIMPIAMOS EL NOMBRE GUARDADO PARA QUE NO QUEDE DATO VIEJO DE OTRA SESIÓN
    localStorage.removeItem('nombreTutor');
    this.tokenSignal.set(null);
    this.sesionActivaSignal.set(false);
  }

  // MÉTODO PARA ACTUALIZAR EL ESTADO DE LA CONVOCATORIA DINÁMICAMENTE
  public establecerEstadoConvocatoria(estado: boolean): void {
    this.convocatoriaActivaSignal.set(estado);
  }

  // VERIFICAR SI HAY UNA CONVOCATORIA ACTIVA EN EL SERVIDOR
  verificarConvocatoriaServidor(): Observable<any> {
    const url = `${environment.apiUrl}/Convocatorias`;
    return this.http.get<any>(url).pipe(
      tap((convocatorias) => {
        // SI EXISTE AL MENOS UNA CONVOCATORIA ACTIVA LA CONVOCATORIA ESTA ABIERTA
        const hayActiva = convocatorias.some(
          (c: any) => c.activacion === true && c.estado === 'Publicada',
        );
        this.convocatoriaActivaSignal.set(hayActiva);
      }),
    );
  }

  // VERIFICAR SI UNA CURP YA ESTA REGISTRADA EN EL SISTEMA
  verificarCurpUnica(curp: string): Observable<any> {
    const url = `${environment.apiUrl}/TutorAspirante/curp/${curp}`;
    return this.http.get<any>(url);
  }

  // REGISTRAR UN NUEVO TUTOR CON DIRECCION
  registrarTutorCompleto(payload: RegistroTutorRequest): Observable<AuthResponse> {
    const url = `${environment.apiUrl}/TutorAspirante`;
    return this.http.post<AuthResponse>(url, payload);
  }

  // INICIO DE SESION DEL TUTOR ASPIRANTE
  login(payload: LoginRequest): Observable<AuthResponse> {
    const url = `${environment.apiUrl}/v1/Auth/Tutor/login`;
    return this.http.post<AuthResponse>(url, payload).pipe(
      tap((res) => {
        if (res && res.token) {
          // CORRECCIÓN: SE AGREGA res.nombreTutor COMO TERCER PARÁMETRO
          // VERIFICAR QUE ESTE SEA EL NOMBRE EXACTO DEL CAMPO QUE DEVUELVE EL BACKEND EN AuthResponse
          this.establecerSesion(res.token, res.claveTutorAspirante, res.nombreTutor);
        }
      }),
    );
  }

  // CIERRE DE SESION DEL TUTOR ASPIRANTE
  logout(claveToken: string): Observable<any> {
    const url = `${environment.apiUrl}/v1/Auth/Tutor/logout`;
    return this.http.post<any>(url, { claveToken }).pipe(
      tap(() => {
        this.cerrarSesion();
      }),
    );
  }

  // RECUPERACION DE CONTRASENA
  recuperarContrasena(payload: RecuperarPasswordRequest): Observable<AuthResponse> {
    const url = `${environment.apiUrl}/v1/Auth/recuperar-contrasena;`;
    return this.http.post<AuthResponse>(url, payload);
  }
}
