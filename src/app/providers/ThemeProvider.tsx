import React, { type ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { theme } from '../../ui/theme/theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
);
