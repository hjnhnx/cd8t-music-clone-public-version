export interface PaginationRequest {
  currentPage: number;
  perPage: number;
  keyword?: string;
}

export interface PageRequest {
  pageSong?: number;
  pageAlbum?: number;
  page?: number;
  size?: number;
  categoryId?: number;
  countryId?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  currentPage: number;
  size: number;
  totalItems: number;
}
