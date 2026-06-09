import type { OrderId } from '../../../domain/entities/Order';

export interface CheckoutState {
  status: 'idle' | 'loading' | 'success' | 'error';
  latestOrderId: OrderId | null;
  error: string | null;
}
