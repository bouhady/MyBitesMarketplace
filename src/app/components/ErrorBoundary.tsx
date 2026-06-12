import React, { type ErrorInfo, type PropsWithChildren } from 'react';
import styled from 'styled-components/native';

type ErrorBoundaryProps = PropsWithChildren;

interface ErrorBoundaryState {
  hasError: boolean;
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  backgroundColor: theme.colors.background,
  gap: theme.spacing.md
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.colors.textPrimary,
  fontSize: 22,
  fontWeight: '700',
  textAlign: 'center'
}));

const Message = styled.Text(({ theme }) => ({
  color: theme.colors.textSecondary,
  fontSize: 16,
  lineHeight: 22,
  textAlign: 'center'
}));

const RetryButton = styled.TouchableOpacity(({ theme }) => ({
  minHeight: 48,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  paddingHorizontal: 20,
  backgroundColor: theme.colors.accent
}));

const ButtonLabel = styled.Text(({ theme }) => ({
  color: theme.colors.accentText,
  fontSize: 16,
  fontWeight: '700'
}));

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep console.error for local debugging; replace with reporting integration if available
    console.error('Unhandled app error', error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    return (
      <>
        {this.state.hasError ? (
          <Container>
            <Title>Something went wrong</Title>
            <Message>The marketplace hit an unexpected issue. Try reloading the app view.</Message>
            <RetryButton accessibilityRole="button" onPress={this.reset}>
              <ButtonLabel>Try again</ButtonLabel>
            </RetryButton>
          </Container>
        ) : (
          this.props.children
        )}
      </>
    );
  }
}
