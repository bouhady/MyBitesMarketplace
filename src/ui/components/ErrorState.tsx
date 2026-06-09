import React from 'react';
import styled from 'styled-components/native';
import { Button } from './Button';
import { BodyText, SubtitleText } from './Text';

const Wrapper = styled.View(({ theme }) => ({
  padding: theme.spacing.xl,
  alignItems: 'center',
  gap: theme.spacing.md
}));

export const ErrorState = ({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) => (
  <Wrapper>
    <SubtitleText>{title}</SubtitleText>
    <BodyText>{message}</BodyText>
    <Button label="Retry" onPress={onRetry} />
  </Wrapper>
);
