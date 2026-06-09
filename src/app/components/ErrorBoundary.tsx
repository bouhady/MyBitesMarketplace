import React, { type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled app error', error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    return (
      <>
        {this.state.hasError ? (
          <View style={styles.container}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>The marketplace hit an unexpected issue. Try reloading the app view.</Text>
            <Pressable accessibilityRole="button" onPress={this.reset} style={styles.button}>
              <Text style={styles.buttonLabel}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          this.props.children
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F7F5EF',
    gap: 16
  },
  title: {
    color: '#1F2421',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center'
  },
  message: {
    color: '#5C625D',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center'
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3D7C59'
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});
