import React, { memo, useCallback } from 'react';
import styled from 'styled-components/native';
import { Button } from '../../../ui/components/Button';
import { BodyText } from '../../../ui/components/Text';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
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

export const QuantitySelector: React.FC<QuantitySelectorProps> = (props) => {
  const { quantity, max, onDecrease, onIncrease } = props;

  return (
    <Row>
      <Button
        label="-"
        variant="secondary"
        accessibilityLabel="Decrease quantity"
        disabled={quantity <= 1}
        onPress={onDecrease}
      />
      <QuantityBox>
        <BodyText>{quantity}</BodyText>
      </QuantityBox>
      <Button
        label="+"
        variant="secondary"
        accessibilityLabel="Increase quantity"
        disabled={quantity >= max}
        onPress={onIncrease}
      />
    </Row>
  );
};

export const QuantitySelectorMemo = memo(QuantitySelector);

interface QuantitySelectorActionBinderProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

export const QuantitySelectorActionBinder: React.FC<QuantitySelectorActionBinderProps> = (props) => {
  const { quantity, max, onChange } = props;

  const handleDecrease = useCallback(() => {
    onChange(Math.max(1, quantity - 1));
  }, [onChange, quantity]);

  const handleIncrease = useCallback(() => {
    onChange(Math.min(max, quantity + 1));
  }, [max, onChange, quantity]);

  return <QuantitySelectorMemo quantity={quantity} max={max} onDecrease={handleDecrease} onIncrease={handleIncrease} />;
};
