import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProviders } from './providers/AppProviders';
import { RootNavigator } from '../navigation/RootNavigator';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </AppProviders>
  );
}
