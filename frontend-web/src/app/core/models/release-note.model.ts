import { ContentBlock } from './blocks/content-block.interface'; // ✅ Caminho corrigido baseado no seu log

export interface ReleaseNote {
  id: string;
  slug: string;
  title: string;
  version?: string;
  category?: string;
  summary?: string;
  content?: string; // HTML legado
  blocks?: ContentBlock[]; // ✅ O array de blocos
  coverImage?: string;
  viewCount?: number;
  publishedAt?: string;
  createdAt?: string;
  status?: 'draft' | 'published' | 'archived';
}
export interface ReleaseNote {
  id: string; // ou number
  slug: string;
  title: string;
  version?: string;
  category?: string;
  summary?: string;
  content?: string; // HTML legado (opcional)
  blocks?: ContentBlock[]; // ✅ O ARRAY DE BLOCOS NOVO
  coverImage?: string;
  viewCount?: number;
  publishedAt?: string;
  createdAt?: string;
  status?: 'draft' | 'published' | 'archived';
}
export interface ReleaseNoteListItem {
  id: number;
  version: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt?: string;
  viewCount?: number;
}


export interface CreateReleaseNoteRequest {
  version: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  content: ContentBlock[];
  isPublished: boolean;
}


export interface UpdateReleaseNoteRequest extends CreateReleaseNoteRequest{
}

export interface Page<T>{
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
