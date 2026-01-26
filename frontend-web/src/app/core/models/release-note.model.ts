import {ContentBlock} from './blocks/content-block.interface';

export interface ReleaseNote{
  id: number;
  version: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  content: ContentBlock[];
  isPublished: boolean;
  publishedAt?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
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
