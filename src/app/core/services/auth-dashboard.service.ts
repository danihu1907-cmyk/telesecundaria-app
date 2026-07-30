import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSignal = signal<string | null>(null);
  public obtenerToken = this.tokenSignal.asReadonly();
}
