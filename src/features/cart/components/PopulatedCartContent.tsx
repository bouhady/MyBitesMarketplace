import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { ScreenContent } from '../../../ui/components/Screen';
import { Button } from '../../../ui/components/Button';
import { Divider } from '../../../ui/components/Divider';
import { useCart } from '../hooks/useCart';
import { CartItemRowActionBinder } from './CartItemRow';
import { CartSummary } from './CartSummary';

type Props = NativeStackScreenProps<RootStackParamList, typeof routes.cart>;

const Footer = styled.View(({ theme }) => ({
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.xxl,
  gap: theme.spacing.md,
  paddingHorizontal: theme.spacing.md
}));

export const PopulatedCartContent = ({ navigation }: Props) => {
  const cart = useCart();

  const checkout = useCallback(() => {
    navigation.navigate(routes.checkout);
  }, [navigation]);

  return (
    <ScreenContent>
      <FlashList
        data={cart.entries}
        estimatedItemSize={96}
        renderItem={({ item }) => (
          <React.Fragment key={item.item.productId}>
            <CartItemRowActionBinder
              item={item.item}
              product={item.product}
              onIncrement={cart.increment}
              onDecrement={cart.decrement}
              onRemove={cart.remove}
            />
            <Divider />
          </React.Fragment>
        )}
        keyExtractor={(entry) => entry.item.productId}
        ListFooterComponent={() => (
          <Footer>
            <CartSummary pricing={cart.pricing} />
            <Button label="Checkout" onPress={checkout} />
          </Footer>
        )}
      />
    </ScreenContent>
  );
};
