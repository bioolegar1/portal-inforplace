import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para tipar a resposta do Java
export interface DashboardStats {
  totalReleases: number;
  publishedReleases: number;
  totalUsers: number;
  totalViews: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:8080/api/admin/dashboard';

  getStats(): Observable<DashboardStats> {
    // O Interceptor vai colocar o Token aqui automaticamente!
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}
