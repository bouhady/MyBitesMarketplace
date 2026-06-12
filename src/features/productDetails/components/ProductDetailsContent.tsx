import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import type { Product } from '../../../domain/entities/Product';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { Button } from '../../../ui/components/Button';
import { ScreenContent } from '../../../ui/components/Screen';
import { BodyText, CaptionText, SubtitleText, TitleText } from '../../../ui/components/Text';
import { AddToCartPanelMemo } from './AddToCartPanel';
import { ProductImageCarousel } from './ProductImageCarousel';
import { StockBadge } from './StockBadge';

interface ProductDetailsContentProps {
  product: Product;
  galleryUrls: string[];
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onOpenCart: () => void;
}

const Content = styled.View(({ theme }) => ({
  gap: theme.spacing.md,
  paddingBottom: theme.spacing.xxl
}));

const Price = styled(TitleText)(({ theme }) => ({
  color: theme.colors.accent
}));

export const ProductDetailsContent: React.FC<ProductDetailsContentProps> = (props) => {
  const { product, galleryUrls, quantity, maxQuantity, onQuantityChange, onAddToCart, onOpenCart } = props;

  return (
    <ScreenContent>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Content>
          <ProductImageCarousel urls={galleryUrls} />
          <StockBadge available={product.stock.available} />
          <SubtitleText>{product.title}</SubtitleText>
          <Price>{formatMoney(product.price)}</Price>
          <CaptionText>
            {product.rating.average.toFixed(1)} rating from {product.rating.count} reviews
          </CaptionText>
          <BodyText>{product.description}</BodyText>
          <AddToCartPanelMemo quantity={quantity} max={maxQuantity} onQuantityChange={onQuantityChange} onAdd={onAddToCart} />
          <Button label="View cart" variant="secondary" onPress={onOpenCart} />
        </Content>
      </ScrollView>
    </ScreenContent>
  );
};
