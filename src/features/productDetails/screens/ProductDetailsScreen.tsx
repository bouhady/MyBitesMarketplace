import React, { useCallback, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch } from '../../../app/store/store';
import { CartRepository } from '../../../data/repositories/CartRepository';
import { cartActions } from '../../cart/state/cartSlice';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { BodyText, CaptionText, SubtitleText, TitleText } from '../../../ui/components/Text';
import { LoadingOverlay } from '../../../ui/components/LoadingOverlay';
import { Button } from '../../../ui/components/Button';
import { formatMoney } from '../../../shared/utils/formatMoney';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductImageCarousel } from '../components/ProductImageCarousel';
import { StockBadge } from '../components/StockBadge';
import { AddToCartPanel } from '../components/AddToCartPanel';

type Props = NativeStackScreenProps<RootStackParamList, typeof routes.productDetails>;

const Content = styled.View(({ theme }) => ({
  gap: theme.spacing.md,
  paddingBottom: theme.spacing.xxl
}));

const Price = styled(TitleText)(({ theme }) => ({
  color: theme.colors.accent
}));

export const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { product } = useProductDetails(route.params.productId);
  const maxQuantity = product?.stock.available ?? 0;
  const [quantity, setQuantity] = useState(1);

  const galleryUrls = useMemo(() => product?.images.galleryUrls ?? [], [product]);

  const addToCart = useCallback(() => {
    if (!product) {
      return;
    }
    dispatch(cartActions.addToCart({ product, quantity, addedAt: CartRepository.now() }));
    navigation.navigate(routes.cart);
  }, [dispatch, navigation, product, quantity]);

  if (!product) {
    return (
      <Screen>
        <LoadingOverlay label="Loading product" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenContent>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            <ProductImageCarousel urls={galleryUrls} />
            <StockBadge available={product.stock.available} />
            <SubtitleText>{product.title}</SubtitleText>
            <Price>{formatMoney(product.price)}</Price>
            <CaptionText>{product.rating.average.toFixed(1)} rating from {product.rating.count} reviews</CaptionText>
            <BodyText>{product.description}</BodyText>
            <AddToCartPanel quantity={quantity} max={maxQuantity} onQuantityChange={setQuantity} onAdd={addToCart} />
            <Button label="View cart" variant="secondary" onPress={() => navigation.navigate(routes.cart)} />
          </Content>
        </ScrollView>
      </ScreenContent>
    </Screen>
  );
};
