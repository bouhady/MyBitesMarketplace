import React from 'react';
import styled from 'styled-components/native';
import { BodyText, SubtitleText } from '../../../ui/components/Text';

const Wrapper = styled.View(({ theme }) => ({
  padding: theme.spacing.xl,
  alignItems: 'center',
  gap: theme.spacing.sm
}));

export const CatalogEmptyState = () => (
  <Wrapper>
    <SubtitleText>No products found</SubtitleText>
    <BodyText>Try another search or category.</BodyText>
  </Wrapper>
);
