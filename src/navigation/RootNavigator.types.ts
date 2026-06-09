import type { ProductId } from '../domain/entities/Product';
import type { routes } from './routes';

export type RootStackParamList = {
  [routes.catalog]: undefined;
  [routes.productDetails]: { productId: ProductId };
  [routes.cart]: undefined;
  [routes.checkout]: undefined;
  [routes.orderSuccess]: undefined;
  [routes.orderError]: undefined;
};
