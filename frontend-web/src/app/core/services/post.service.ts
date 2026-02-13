import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import {
  Post,
  PostListItem,
  CreatePostRequest,
  UpdatePostRequest
} from '../models/post.model'; // Lógica: Use as novas interfaces genéricas
import { Page } from '../models/release-note.model';

@Injectable({
  providedIn: 'root'
})
export class PostService extends ApiService {
  // Lógica: URLs atualizadas para bater com o @RequestMapping do seu Java
  private apiUrl = 'https://localhost:8080/api/admin/posts';
  private publicUrl = 'https://localhost:8080/api/public/posts';

  // ========== ENDPOINTS PÚBLICOS ==========

  // Lógica: Busca apenas o que está marcado como 'is_published = true' no banco
  getPublishedPosts(page: number = 0, size: number = 10): Observable<Page<PostListItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'publishedAt,desc');

    return this.get<Page<PostListItem>>('/public/posts', params);
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.get<Post>(`/public/posts/${slug}`);
  }

  incrementViewCount(slug: string): Observable<void> {
    return this.post<void>(`/public/posts/${slug}/view`, {});
  }

  // ========== ENDPOINTS ADMIN ==========

  // Lógica: O Admin consegue ver rascunhos e publicados para gestão
  getAllPosts(published?: boolean, page: number = 0, size: number = 10): Observable<Page<PostListItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (published !== undefined) {
      params = params.set('published', published.toString());
    }

    return this.get<Page<PostListItem>>('/admin/posts', params);
  }

  createPost(request: CreatePostRequest): Observable<Post> {
    return this.post<Post>('/admin/posts', request);
  }

  getPostById(id: number): Observable<Post> {
    // Lógica: Usando o helper do ApiService para manter o padrão
    return this.get<Post>(`/admin/posts/${id}`);
  }

  updatePost(id: number, request: UpdatePostRequest): Observable<Post> {
    return this.put<Post>(`/admin/posts/${id}`, request);
  }

  deletePost(id: number): Observable<void> {
    return this.delete<void>(`/admin/posts/${id}`);
  }
}
