import React, { type PropsWithChildren } from 'react';
import { StoreProvider } from './StoreProvider';
import { ThemeProvider } from './ThemeProvider';
import { NavigationProvider } from './NavigationProvider';
import { Root } from './Root';

type AppProvidersProps = PropsWithChildren;

export const AppProviders: React.FC<AppProvidersProps> = (props) => {
  const { children } = props;

  return (
    <Root>
      <ThemeProvider>
        <StoreProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </StoreProvider>
      </ThemeProvider>
    </Root>
  );
};
