import React, { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoreProvider } from './StoreProvider';
import { ThemeProvider } from './ThemeProvider';
import { NavigationProvider } from './NavigationProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
      <StoreProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </StoreProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
);
