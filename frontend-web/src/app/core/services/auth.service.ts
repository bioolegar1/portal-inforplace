import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // Importante para SSR

// Ajuste para a URL do seu backend
const API_URL = 'https://localhost:8080/api/auth';

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID); // Identifica se é Server ou Browser

  // Estado reativo do usuário (acessível em toda a app)
  currentUser = signal<any>(null);

  constructor() {
    // Ao iniciar, verifica se já tem usuário salvo no localStorage
    this.tryAutoLogin();
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/login`, credentials).pipe(
      tap(response => {
        // Só salva no localStorage se estiver no navegador
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Atualiza o sinal para a interface reagir
        this.currentUser.set(response.user);
      })
    );
  }

  logout() {
    // Só tenta limpar se estiver no navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    // Se for servidor, nunca está autenticado (para evitar erro)
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private tryAutoLogin() {
    // CORREÇÃO DO ERRO: Verifica se é navegador antes de acessar localStorage
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        this.currentUser.set(JSON.parse(user));
      }
    }
  }
}
