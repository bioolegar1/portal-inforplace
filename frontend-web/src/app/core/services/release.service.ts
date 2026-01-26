// src/app/core/services/release.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  ReleaseNote,
  ReleaseNoteListItem,
  CreateReleaseNoteRequest,
  UpdateReleaseNoteRequest,
  Page
} from '../models/release-note.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService extends ApiService {

  // ========== ENDPOINTS PÚBLICOS ==========

  getPublishedReleases(page: number = 0, size: number = 10): Observable<Page<ReleaseNoteListItem>> {
    return this.get<Page<ReleaseNoteListItem>>(`/public/releases?page=${page}&size=${size}`);
  }

  getReleaseBySlug(slug: string): Observable<ReleaseNote> {
    return this.get<ReleaseNote>(`/public/releases/${slug}`);
  }

  incrementViewCount(slug: string): Observable<void> {
    return this.post<void>(`/public/releases/${slug}/view`, {});
  }

  // ========== ENDPOINTS ADMIN ==========

  getAllReleases(published?: boolean, page: number = 0, size: number = 10): Observable<Page<ReleaseNote>> {
    const params = published !== undefined
      ? `?published=${published}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
    return this.get<Page<ReleaseNote>>(`/admin/releases${params}`);
  }

  getReleaseById(id: number): Observable<ReleaseNote> {
    return this.get<ReleaseNote>(`/admin/releases/${id}`);
  }

  createRelease(request: CreateReleaseNoteRequest): Observable<ReleaseNote> {
    return this.post<ReleaseNote>('/admin/releases', request);
  }

  updateRelease(id: number, request: UpdateReleaseNoteRequest): Observable<ReleaseNote> {
    return this.put<ReleaseNote>(`/admin/releases/${id}`, request);
  }

  publishRelease(id: number): Observable<ReleaseNote> {
    return this.patch<ReleaseNote>(`/admin/releases/${id}/publish`);
  }

  unpublishRelease(id: number): Observable<ReleaseNote> {
    return this.patch<ReleaseNote>(`/admin/releases/${id}/unpublish`);
  }

  deleteRelease(id: number): Observable<void> {
    return this.delete<void>(`/admin/releases/${id}`);
  }
}
