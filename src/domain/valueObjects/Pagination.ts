export interface PageRequest {
  page: number;
  limit: number;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
