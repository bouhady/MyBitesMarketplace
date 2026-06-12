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

interface QuantityStepperProps {
  quantity: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = (props) => {
  const { quantity, canIncrement, onIncrement, onDecrement } = props;

  return (
    <Row>
      <Button label="-" variant="secondary" accessibilityLabel="Decrease quantity" onPress={onDecrement} />
      <Count>
        <BodyText>{quantity}</BodyText>
      </Count>
      <Button label="+" variant="secondary" accessibilityLabel="Increase quantity" disabled={!canIncrement} onPress={onIncrement} />
    </Row>
  );
};

export const QuantityStepperMemo = memo(QuantityStepper);
