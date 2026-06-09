import React, { memo } from 'react';
import styled from 'styled-components/native';
import { Button } from '../../../ui/components/Button';
import { BodyText } from '../../../ui/components/Text';

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm
}));

const Count = styled.View(({ theme }) => ({
  minWidth: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.radii.sm,
  borderWidth: 1,
  borderColor: theme.colors.border
}));

export const QuantityStepper = memo(
  ({ quantity, canIncrement, onIncrement, onDecrement }: { quantity: number; canIncrement: boolean; onIncrement: () => void; onDecrement: () => void }) => (
    <Row>
      <Button label="-" variant="secondary" onPress={onDecrement} />
      <Count>
        <BodyText>{quantity}</BodyText>
      </Count>
      <Button label="+" variant="secondary" disabled={!canIncrement} onPress={onIncrement} />
    </Row>
  )
);
