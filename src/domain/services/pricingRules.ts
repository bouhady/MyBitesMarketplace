import type { CartItem } from '../entities/CartItem';
import type { Product, ProductId } from '../entities/Product';
import { makeMoney, type Money } from '../valueObjects/Money';

export interface CartPricingSummary {
  subtotal: Money;
  tax: Money;
  discount: Money;
  total: Money;
  totalItems: number;
}

const TAX_RATE = 0.0825;
const BULK_DISCOUNT_THRESHOLD = 150;
const BULK_DISCOUNT_RATE = 0.05;

export const calculateCartPricing = (
  items: CartItem[],
  productsById: Record<ProductId, Product>
): CartPricingSummary => {
  const subtotalAmount = items.reduce((sum, item) => {
    const product = productsById[item.productId];
    return product ? sum + product.price.amount * item.quantity : sum;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = subtotalAmount >= BULK_DISCOUNT_THRESHOLD ? subtotalAmount * BULK_DISCOUNT_RATE : 0;
  const taxableAmount = subtotalAmount - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;

  return {
    subtotal: makeMoney(subtotalAmount),
    tax: makeMoney(taxAmount),
    discount: makeMoney(discountAmount),
    total: makeMoney(taxableAmount + taxAmount),
    totalItems
  };
};
