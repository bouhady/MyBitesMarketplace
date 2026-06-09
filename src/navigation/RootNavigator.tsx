import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductCatalogScreen } from '../features/catalog/screens/ProductCatalogScreen';
import { ProductDetailsScreen } from '../features/productDetails/screens/ProductDetailsScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { CheckoutScreen } from '../features/checkout/screens/CheckoutScreen';
import { OrderSuccessScreen } from '../features/checkout/screens/OrderSuccessScreen';
import { OrderErrorScreen } from '../features/checkout/screens/OrderErrorScreen';
import type { RootStackParamList } from './RootNavigator.types';
import { routes } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName={routes.catalog}
    screenOptions={{
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#F7F5EF' },
      headerTitleStyle: { color: '#1F2421' }
    }}
  >
    <Stack.Screen name={routes.catalog} component={ProductCatalogScreen} options={{ title: 'MyBites' }} />
    <Stack.Screen name={routes.productDetails} component={ProductDetailsScreen} options={{ title: 'Product' }} />
    <Stack.Screen name={routes.cart} component={CartScreen} options={{ title: 'Cart' }} />
    <Stack.Screen name={routes.checkout} component={CheckoutScreen} options={{ title: 'Checkout' }} />
    <Stack.Screen name={routes.orderSuccess} component={OrderSuccessScreen} options={{ title: 'Order placed' }} />
    <Stack.Screen name={routes.orderError} component={OrderErrorScreen} options={{ title: 'Order issue' }} />
  </Stack.Navigator>
);
