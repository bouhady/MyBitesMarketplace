import styled from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// The top-level root view for the app, themed for consistency with styled-components.
export const Root = styled(GestureHandlerRootView)(() => ({
  flex: 1
}));
