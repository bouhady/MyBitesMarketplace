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
    {rootRoutes.map(route => (
      <Stack.Screen key={route.name} name={route.name} component={route.component} options={route.options} />
    ))}
  </Stack.Navigator>
);
