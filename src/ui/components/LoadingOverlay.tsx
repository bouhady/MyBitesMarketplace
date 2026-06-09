import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { CaptionText } from './Text';

const Wrapper = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing.xl,
  gap: theme.spacing.md
}));

export const LoadingOverlay = ({ label = 'Loading' }: { label?: string }) => (
  <Wrapper>
    <ActivityIndicator />
    <CaptionText>{label}</CaptionText>
  </Wrapper>
);
