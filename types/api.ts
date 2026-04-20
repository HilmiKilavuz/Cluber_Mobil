// types/api.ts
// Web projesiyle aynı API response formatları

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}
