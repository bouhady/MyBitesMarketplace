import type { AppTheme } from './tokens';

export const theme: AppTheme = {
  colors: {
    background: '#F7F5EF',
    surface: '#FFFFFF',
    surfaceMuted: '#EEEAE1',
    textPrimary: '#1F2421',
    textSecondary: '#66706A',
    border: '#D8D2C3',
    accent: '#0F766E',
    accentText: '#FFFFFF',
    success: '#15803D',
    warning: '#B45309',
    danger: '#B91C1C'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radii: {
    sm: 6,
    md: 8
  },
  typography: {
    title: { fontSize: 28, fontWeight: '700', lineHeight: '34px' },
    subtitle: { fontSize: 20, fontWeight: '700', lineHeight: '26px' },
    body: { fontSize: 16, fontWeight: '400', lineHeight: '22px' },
    caption: { fontSize: 13, fontWeight: '500', lineHeight: '18px' },
    button: { fontSize: 15, fontWeight: '700', lineHeight: '20px' }
  }
};
