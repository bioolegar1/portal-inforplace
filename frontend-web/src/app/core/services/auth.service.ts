import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, of, delay } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Injeta o identificador da plataforma
  private platformId = inject(PLATFORM_ID);

  // ✅ PASSO 1: Inicializa com valores seguros (padrão para servidor)
  // Isso evita que o erro "localStorage is not defined" ocorra na criação da classe
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    super(); // Chama o construtor do ApiService

    // ✅ PASSO 2: Hidrata os dados APENAS se estiver no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.hydrateSession();
    }
  }

  // Recupera dados do storage e atualiza os signals
  private hydrateSession(): void {
    const token = this.getToken();
    const user = this.getUserFromStorage();

    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const mockResponse: LoginResponse = {
      token: 'fake-jwt-token-123456',
      type: 'Bearer',
      user: {
        id: 1,
        name: 'Admin Inforplace',
        email: credentials.email,
        role: UserRole.ADMIN
      }
    };

    return of(mockResponse).pipe(
      delay(1000),
      tap((response) => this.setSession(response))
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  // Métodos de utilidade protegidos
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private setSession(authResult: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, authResult.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    }

    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  private getUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (!userJson) return null;
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }
}
