import React from 'react';
import styled from 'styled-components/native';

const Badge = styled.View<{ inStock: boolean }>(({ theme, inStock }) => ({
  alignSelf: 'flex-start',
  borderRadius: theme.radii.sm,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
  backgroundColor: inStock ? '#DCFCE7' : '#FEE2E2'
}));

const Label = styled.Text<{ inStock: boolean }>(({ theme, inStock }) => ({
  ...theme.typography.caption,
  color: inStock ? theme.colors.success : theme.colors.danger
}));

interface StockBadgeProps {
  available: number;
}

export const StockBadge: React.FC<StockBadgeProps> = (props) => {
  const { available } = props;
  const inStock = available > 0;

  return (
    <Badge inStock={inStock}>
      <Label inStock={inStock}>{inStock ? `${available} in stock` : 'Out of stock'}</Label>
    </Badge>
  );
};
