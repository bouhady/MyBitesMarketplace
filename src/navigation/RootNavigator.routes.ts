import type React from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ProductCatalogScreen } from '../features/catalog/screens/ProductCatalogScreen';
import { ProductDetailsScreen } from '../features/productDetails/screens/ProductDetailsScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { CheckoutScreen } from '../features/checkout/screens/CheckoutScreen';
import { OrderSuccessScreen } from '../features/checkout/screens/OrderSuccessScreen';
import { OrderErrorScreen } from '../features/checkout/screens/OrderErrorScreen';
import type { RootStackParamList } from './RootNavigator.types';
import { routes } from './routes';

export type RootRoute = {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  options: NativeStackNavigationOptions;
};

export const rootRoutes: RootRoute[] = [
  { name: routes.catalog, component: ProductCatalogScreen, options: { title: 'MyBites' } },
  { name: routes.productDetails, component: ProductDetailsScreen, options: { title: 'Product' } },
  { name: routes.cart, component: CartScreen, options: { title: 'Cart' } },
  { name: routes.checkout, component: CheckoutScreen, options: { title: 'Checkout' } },
  { name: routes.orderSuccess, component: OrderSuccessScreen, options: { title: 'Order placed' } },
  { name: routes.orderError, component: OrderErrorScreen, options: { title: 'Order issue' } }
];
