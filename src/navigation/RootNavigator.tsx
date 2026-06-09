import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './RootNavigator.types';
import { rootRoutes } from './RootNavigator.routes';
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
    <Stack.Screen
      name={rootRoutes.catalog.name}
      component={rootRoutes.catalog.component}
      options={rootRoutes.catalog.options}
    />
    <Stack.Screen
      name={rootRoutes.productDetails.name}
      component={rootRoutes.productDetails.component}
      options={rootRoutes.productDetails.options}
    />
    <Stack.Screen name={rootRoutes.cart.name} component={rootRoutes.cart.component} options={rootRoutes.cart.options} />
    <Stack.Screen
      name={rootRoutes.checkout.name}
      component={rootRoutes.checkout.component}
      options={rootRoutes.checkout.options}
    />
    <Stack.Screen
      name={rootRoutes.orderSuccess.name}
      component={rootRoutes.orderSuccess.component}
      options={rootRoutes.orderSuccess.options}
    />
    <Stack.Screen
      name={rootRoutes.orderError.name}
      component={rootRoutes.orderError.component}
      options={rootRoutes.orderError.options}
    />
  </Stack.Navigator>
);
