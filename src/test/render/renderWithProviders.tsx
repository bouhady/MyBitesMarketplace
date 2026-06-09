import React, { type ReactElement } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, type RenderAPI } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { rootReducer, type RootState } from '../../app/store/rootReducer';
import { theme } from '../../ui/theme/theme';

export const renderWithProviders = (
  ui: ReactElement,
  preloadedState?: Partial<RootState>
): RenderAPI => {
  const storeOptions = preloadedState === undefined ? { reducer: rootReducer } : { reducer: rootReducer, preloadedState };

  return render(
    <Provider store={configureStore(storeOptions)}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>
  );
};
