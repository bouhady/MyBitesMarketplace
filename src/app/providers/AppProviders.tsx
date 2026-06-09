import React, { type ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';
import { ThemeProvider } from './ThemeProvider';
import { NavigationProvider } from './NavigationProvider';
import { Root } from './Root';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Root>
    <ThemeProvider>
      <StoreProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </StoreProvider>
    </ThemeProvider>
  </Root>
);
