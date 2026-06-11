import React, { memo, useCallback } from 'react';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import type { CartItem } from '../../../domain/entities/CartItem';
import type { Product, ProductId } from '../../../domain/entities/Product';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { getCachePolicy } from '../../../shared/utils/imageCache';
import { Button } from '../../../ui/components/Button';
import { BodyText, CaptionText } from '../../../ui/components/Text';
import { QuantityStepper } from './QuantityStepper';

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

interface CartItemRowProps {
  item: CartItem;
  product: Product;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = (props) => {
  const { item, product, onIncrement, onDecrement, onRemove } = props;

  return (
    <Row>
      <Thumb source={{ uri: product.images.thumbnailUrl }} cachePolicy={getCachePolicy()} contentFit="cover" />
      <Info>
        <BodyText numberOfLines={2}>{product.title}</BodyText>
        <CaptionText>{formatMoney(product.price)} each</CaptionText>
        <QuantityStepper
          quantity={item.quantity}
          canIncrement={item.quantity < product.stock.available}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
        <Button label="Remove" variant="danger" onPress={onRemove} />
      </Info>
    </Row>
  );
};

export const CartItemRowMemo = memo(CartItemRow);

interface CartItemRowActionBinderProps {
  item: CartItem;
  product: Product;
  onIncrement: (productId: ProductId) => void;
  onDecrement: (productId: ProductId) => void;
  onRemove: (productId: ProductId) => void;
}

export const CartItemRowActionBinder: React.FC<CartItemRowActionBinderProps> = (props) => {
  const { item, product, onIncrement, onDecrement, onRemove } = props;

  const handleIncrement = useCallback(() => {
    onIncrement(product.id);
  }, [onIncrement, product.id]);

  const handleDecrement = useCallback(() => {
    onDecrement(product.id);
  }, [onDecrement, product.id]);

  const handleRemove = useCallback(() => {
    onRemove(product.id);
  }, [onRemove, product.id]);

  return (
    <CartItemRowMemo
      item={item}
      product={product}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      onRemove={handleRemove}
    />
  );
};
