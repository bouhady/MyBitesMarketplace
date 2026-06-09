import React, { memo } from 'react';
import styled from 'styled-components/native';
import { Button } from '../../../ui/components/Button';
import { BodyText } from '../../../ui/components/Text';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md
}));

const QuantityBox = styled.View(({ theme }) => ({
  minWidth: 48,
  height: 48,
  borderRadius: theme.radii.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.surface
}));

export const QuantitySelector = memo(({ quantity, max, onChange }: QuantitySelectorProps) => (
  <Row>
    <Button label="-" variant="secondary" disabled={quantity <= 1} onPress={() => onChange(Math.max(1, quantity - 1))} />
    <QuantityBox>
      <BodyText>{quantity}</BodyText>
    </QuantityBox>
    <Button label="+" variant="secondary" disabled={quantity >= max} onPress={() => onChange(Math.min(max, quantity + 1))} />
  </Row>
));
