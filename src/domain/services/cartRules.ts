import type { CartItem } from '../entities/CartItem';
import type { Product } from '../entities/Product';

export const clampCartQuantity = (requestedQuantity: number, product: Product): number => {
  if (!Number.isFinite(requestedQuantity)) {
    return 0;
  }

  const wholeQuantity = Math.floor(requestedQuantity);
  return Math.max(0, Math.min(wholeQuantity, product.stock.available));
};

export const canAddToCart = (product: Product, currentQuantity: number, requestedQuantity: number): boolean =>
  currentQuantity + requestedQuantity <= product.stock.available;

export const toCartItem = (product: Product, quantity: number, addedAt: string): CartItem => ({
  productId: product.id,
  quantity: clampCartQuantity(quantity, product),
  addedAt
});
