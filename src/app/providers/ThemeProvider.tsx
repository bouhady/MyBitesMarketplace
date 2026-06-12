import React, { type PropsWithChildren } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { theme } from '../../ui/theme/theme';

type ThemeProviderProps = PropsWithChildren;

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children } = props;

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};
