import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProviders } from './providers/AppProviders';
import { RootNavigator } from '../navigation/RootNavigator';

const App = () => (
  <AppProviders>
    <StatusBar style="dark" />
    <ErrorBoundary>
      <RootNavigator />
    </ErrorBoundary>
  </AppProviders>
);

export default App;
