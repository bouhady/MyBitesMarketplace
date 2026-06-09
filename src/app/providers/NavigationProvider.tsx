import React, { type ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';

export const NavigationProvider = ({ children }: { children: ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);
