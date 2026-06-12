import React, { memo, useCallback } from 'react';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import type { Product } from '../../../domain/entities/Product';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { getCachePolicy } from '../../../shared/utils/imageCache';
import { BodyText, CaptionText } from '../../../ui/components/Text';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const Card = styled(Pressable)(({ theme }) => ({
  flex: 1,
  minHeight: 238,
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radii.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  overflow: 'hidden',
  margin: theme.spacing.sm
}));

const ProductImage = styled(Image)({
  width: '100%',
  height: 128
});

const Content = styled.View(({ theme }) => ({
  padding: theme.spacing.md,
  gap: theme.spacing.xs
}));

const Price = styled(BodyText)(({ theme }) => ({
  color: theme.colors.accent,
  fontWeight: '700'
}));

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { product, onPress } = props;

  return (
    <Card accessibilityRole="button" accessibilityLabel={`Open ${product.title}`} onPress={onPress}>
      <ProductImage source={{ uri: product.images.thumbnailUrl }} cachePolicy={getCachePolicy()} contentFit="cover" />
      <Content>
        <BodyText numberOfLines={2}>{product.title}</BodyText>
        <CaptionText>{product.rating.average.toFixed(1)} rating</CaptionText>
        <CaptionText>{product.stock.available > 0 ? `${product.stock.available} in stock` : 'Out of stock'}</CaptionText>
        <Price>{formatMoney(product.price)}</Price>
      </Content>
    </Card>
  );
};

export const ProductCardMemo = memo(ProductCard);

interface ProductCardActionBinderProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCardActionBinder: React.FC<ProductCardActionBinderProps> = (props) => {
  const { product, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(product);
  }, [onPress, product]);

  return <ProductCardMemo product={product} onPress={handlePress} />;
};
