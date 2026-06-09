import type { CartItem } from '../../../domain/entities/CartItem';
import type { ProductId } from '../../../domain/entities/Product';

export interface CartState {
  itemsByProductId: Record<ProductId, CartItem>;
  hydrationStatus: 'idle' | 'loading' | 'success' | 'error';
  hydrationError: string | null;
}

export type PersistableCartState = Pick<CartState, 'itemsByProductId'>;
