import React, { memo } from 'react';
import styled from 'styled-components/native';
import { Button } from '../../../ui/components/Button';
import { CaptionText } from '../../../ui/components/Text';
import { QuantitySelector } from './QuantitySelector';

interface AddToCartPanelProps {
  quantity: number;
  max: number;
  onQuantityChange: (quantity: number) => void;
  onAdd: () => void;
}

const Panel = styled.View(({ theme }) => ({
  gap: theme.spacing.md,
  paddingVertical: theme.spacing.lg
}));

export const AddToCartPanel = memo(({ quantity, max, onQuantityChange, onAdd }: AddToCartPanelProps) => (
  <Panel>
    <QuantitySelector quantity={quantity} max={Math.max(1, max)} onChange={onQuantityChange} />
    <Button label="Add to cart" disabled={max <= 0} onPress={onAdd} />
    {max <= 0 ? <CaptionText>This item is currently unavailable.</CaptionText> : null}
  </Panel>
));
