import 'styled-components/native';
import type { AppTheme } from './tokens';

declare module 'styled-components/native' {
  export interface DefaultTheme extends AppTheme {}
}
