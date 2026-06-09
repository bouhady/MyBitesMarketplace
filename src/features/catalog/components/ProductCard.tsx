import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import type { Product } from '../../../domain/entities/Product';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { getCachePolicy } from '../../../shared/utils/imageCache';
import { BodyText, CaptionText } from '../../../ui/components/Text';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
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

export const ProductCard = memo(({ product, onPress }: ProductCardProps) => (
  <Card accessibilityRole="button" accessibilityLabel={`Open ${product.title}`} onPress={() => onPress(product)}>
    <ProductImage source={{ uri: product.images.thumbnailUrl }} cachePolicy={getCachePolicy()} contentFit="cover" />
    <Content>
      <BodyText numberOfLines={2}>{product.title}</BodyText>
      <CaptionText>{product.rating.average.toFixed(1)} rating</CaptionText>
      <CaptionText>{product.stock.available > 0 ? `${product.stock.available} in stock` : 'Out of stock'}</CaptionText>
      <Price>{formatMoney(product.price)}</Price>
    </Content>
  </Card>
));
