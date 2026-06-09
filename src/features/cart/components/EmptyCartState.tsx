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

const EmptyTitle = styled(SubtitleText)({
  width: '100%',
  flexShrink: 1,
  textAlign: 'center',
  writingDirection: 'ltr'
});

const EmptyMessage = styled(BodyText)({
  width: '100%',
  flexShrink: 1,
  textAlign: 'center',
  writingDirection: 'ltr'
});

export const EmptyCartState = () => (
  <Wrapper>
    <EmptyTitle>Your cart is empty</EmptyTitle>
    <EmptyMessage>Add products from the marketplace.</EmptyMessage>
  </Wrapper>
);
