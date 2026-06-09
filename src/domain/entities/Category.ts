import type { CategoryId } from './Product';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  productCount: number;
}
