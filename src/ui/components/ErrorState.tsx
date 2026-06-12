import React from 'react';
import styled from 'styled-components/native';
import { Button } from './Button';
import { BodyText, SubtitleText } from './Text';

const Wrapper = styled.View(({ theme }) => ({
  padding: theme.spacing.xl,
  alignItems: 'center',
  gap: theme.spacing.md
}));

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = (props) => {
  const { title, message, onRetry } = props;

  return (
    <Wrapper>
      <SubtitleText>{title}</SubtitleText>
      <BodyText>{message}</BodyText>
      <Button label="Retry" onPress={onRetry} />
    </Wrapper>
  );
};
