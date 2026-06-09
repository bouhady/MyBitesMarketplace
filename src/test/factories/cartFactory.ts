import type { CartItem } from '../../domain/entities/CartItem';

export const cartItemFactory = (overrides: Partial<CartItem> = {}): CartItem => ({
  productId: 'product-test',
  quantity: 1,
  addedAt: '2026-01-01T00:00:00.000Z',
  ...overrides
});
