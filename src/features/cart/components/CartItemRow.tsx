import React, { memo } from 'react';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import type { CartItem } from '../../../domain/entities/CartItem';
import type { Product } from '../../../domain/entities/Product';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { getCachePolicy } from '../../../shared/utils/imageCache';
import { Button } from '../../../ui/components/Button';
import { BodyText, CaptionText } from '../../../ui/components/Text';
import { QuantityStepper } from './QuantityStepper';

interface CartItemRowProps {
  item: CartItem;
  product: Product;
  onIncrement: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onRemove: (productId: string) => void;
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing.md,
  paddingVertical: theme.spacing.md
}));

const Thumb = styled(Image)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.radii.md,
  backgroundColor: theme.colors.surfaceMuted
}));

const Info = styled.View(({ theme }) => ({
  flex: 1,
  gap: theme.spacing.xs
}));

export const CartItemRow = memo(({ item, product, onIncrement, onDecrement, onRemove }: CartItemRowProps) => (
  <Row>
    <Thumb source={{ uri: product.images.thumbnailUrl }} cachePolicy={getCachePolicy()} contentFit="cover" />
    <Info>
      <BodyText numberOfLines={2}>{product.title}</BodyText>
      <CaptionText>{formatMoney(product.price)} each</CaptionText>
      <QuantityStepper
        quantity={item.quantity}
        canIncrement={item.quantity < product.stock.available}
        onIncrement={() => onIncrement(product)}
        onDecrement={() => onDecrement(product)}
      />
      <Button label="Remove" variant="danger" onPress={() => onRemove(product.id)} />
    </Info>
  </Row>
));
