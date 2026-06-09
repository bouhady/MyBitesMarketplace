import type { CartItem } from './CartItem';
import type { Money } from '../valueObjects/Money';

export type OrderId = string;
export type OrderStatus = 'pending' | 'confirmed' | 'failed';

export interface Order {
  id: OrderId;
  items: CartItem[];
  subtotal: Money;
  tax: Money;
  discount: Money;
  total: Money;
  status: OrderStatus;
  createdAt: string;
}
