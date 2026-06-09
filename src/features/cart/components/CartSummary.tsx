import React, { memo } from 'react';
import styled from 'styled-components/native';
import type { CartPricingSummary } from '../../../domain/services/pricingRules';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { BodyText, SubtitleText } from '../../../ui/components/Text';
import { Divider } from '../../../ui/components/Divider';

const Panel = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radii.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.lg,
  gap: theme.spacing.sm
}));

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between'
});

export const CartSummary = memo(({ pricing }: { pricing: CartPricingSummary }) => (
  <Panel>
    <SubtitleText>Summary</SubtitleText>
    <Row><BodyText>Items</BodyText><BodyText>{pricing.totalItems}</BodyText></Row>
    <Row><BodyText>Subtotal</BodyText><BodyText>{formatMoney(pricing.subtotal)}</BodyText></Row>
    <Row><BodyText>Discount</BodyText><BodyText>{formatMoney(pricing.discount)}</BodyText></Row>
    <Row><BodyText>Tax</BodyText><BodyText>{formatMoney(pricing.tax)}</BodyText></Row>
    <Divider />
    <Row><SubtitleText>Total</SubtitleText><SubtitleText>{formatMoney(pricing.total)}</SubtitleText></Row>
  </Panel>
));
