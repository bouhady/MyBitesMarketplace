import React, { useCallback, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../../app/store/store';
import { CartRepository } from '../../../data/repositories/CartRepository';
import { cartActions } from '../../cart/state/cartSlice';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen } from '../../../ui/components/Screen';
import { LoadingOverlay } from '../../../ui/components/LoadingOverlay';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductDetailsContent } from '../components/ProductDetailsContent';
import { ProductUnavailableState } from '../components/ProductUnavailableState';

type ProductDetailsScreenProps = NativeStackScreenProps<RootStackParamList, typeof routes.productDetails>;

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = (props) => {
  const { route, navigation } = props;
  const dispatch = useAppDispatch();
  const { product, status, error, retry } = useProductDetails(route.params.productId);
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

  const openCart = useCallback(() => {
    navigation.navigate(routes.cart);
  }, [navigation]);

  const backToCatalog = useCallback(() => {
    navigation.navigate(routes.catalog);
  }, [navigation]);

  return (
    <Screen>
      {product ? (
        <ProductDetailsContent
          product={product}
          galleryUrls={galleryUrls}
          quantity={quantity}
          maxQuantity={maxQuantity}
          onQuantityChange={setQuantity}
          onAddToCart={addToCart}
          onOpenCart={openCart}
        />
      ) : status === 'idle' || status === 'loading' ? (
        <LoadingOverlay label="Loading product" />
      ) : (
        <ProductUnavailableState error={error} onRetry={retry} onBackToCatalog={backToCatalog} />
      )}
    </Screen>
  );
};
