import type React from 'react';
import type { NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductCatalogScreen } from '../features/catalog/screens/ProductCatalogScreen';
import { ProductDetailsScreen } from '../features/productDetails/screens/ProductDetailsScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { CheckoutScreen } from '../features/checkout/screens/CheckoutScreen';
import { OrderSuccessScreen } from '../features/checkout/screens/OrderSuccessScreen';
import { OrderErrorScreen } from '../features/checkout/screens/OrderErrorScreen';
import type { RootStackParamList } from './RootNavigator.types';
import { routes } from './routes';

export type RootRoute<RouteName extends keyof RootStackParamList> = {
  name: RouteName;
  component: React.ComponentType<NativeStackScreenProps<RootStackParamList, RouteName>>;
  options: NativeStackNavigationOptions;
};

const defineRootRoute = <RouteName extends keyof RootStackParamList>(
  route: RootRoute<RouteName>
): RootRoute<RouteName> => route;

export const rootRoutes = {
  catalog: defineRootRoute({ name: routes.catalog, component: ProductCatalogScreen, options: { title: 'MyBites' } }),
  productDetails: defineRootRoute({ name: routes.productDetails, component: ProductDetailsScreen, options: { title: 'Product' } }),
  cart: defineRootRoute({ name: routes.cart, component: CartScreen, options: { title: 'Cart' } }),
  checkout: defineRootRoute({ name: routes.checkout, component: CheckoutScreen, options: { title: 'Checkout' } }),
  orderSuccess: defineRootRoute({ name: routes.orderSuccess, component: OrderSuccessScreen, options: { title: 'Order placed' } }),
  orderError: defineRootRoute({ name: routes.orderError, component: OrderErrorScreen, options: { title: 'Order issue' } })
};
