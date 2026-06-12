import React, { type PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';

type NavigationProviderProps = PropsWithChildren;

export const NavigationProvider: React.FC<NavigationProviderProps> = (props) => {
  const { children } = props;

  return <NavigationContainer>{children}</NavigationContainer>;
};
