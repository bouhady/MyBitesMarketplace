import type { ProductId } from './Product';

export interface CartItem {
  productId: ProductId;
  quantity: number;
  addedAt: string;
}
