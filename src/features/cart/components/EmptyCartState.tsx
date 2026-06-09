import React from 'react';
import styled from 'styled-components/native';
import { BodyText, SubtitleText } from '../../../ui/components/Text';

const Wrapper = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
  padding: theme.spacing.xl
}));

export const EmptyCartState = () => (
  <Wrapper>
    <SubtitleText>Your cart is empty</SubtitleText>
    <BodyText>Add products from the marketplace.</BodyText>
  </Wrapper>
);
