import type { TextStyle } from 'react-native';

interface TypographyToken {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: `${number}px`;
}

export interface AppTheme {
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    accent: string;
    accentText: string;
    success: string;
    warning: string;
    danger: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
  };
  typography: {
    title: TypographyToken;
    subtitle: TypographyToken;
    body: TypographyToken;
    caption: TypographyToken;
    button: TypographyToken;
  };
}
