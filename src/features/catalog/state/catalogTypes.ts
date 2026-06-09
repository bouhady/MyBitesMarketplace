import type { Category } from '../../../domain/entities/Category';
import type { CategoryId, Product, ProductId } from '../../../domain/entities/Product';
import type { ProductSort } from '../../../domain/valueObjects/Sort';
import type { AsyncStatus } from '../../../shared/types/AsyncStatus';

export type CatalogRequestSignature = string;

export interface CatalogState {
  ids: ProductId[];
  entities: Record<ProductId, Product>;
  categories: Category[];
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
  query: string;
  debouncedQuery: string;
  selectedCategoryId: CategoryId | null;
  sort: ProductSort;
  status: AsyncStatus;
  error: string | null;
  activeRequestSignature: CatalogRequestSignature | null;
  productDetailsStatusById: Partial<Record<ProductId, AsyncStatus>>;
  productDetailsErrorById: Partial<Record<ProductId, string | null>>;
}

export type CatalogRequestMode = 'initial' | 'refresh' | 'loadMore';
