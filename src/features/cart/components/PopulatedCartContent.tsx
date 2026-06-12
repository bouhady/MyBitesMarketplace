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
import { CartSummaryMemo } from './CartSummary';
import type { CartPricingSummary } from '../../../domain/services/pricingRules';

type PopulatedCartContentProps = NativeStackScreenProps<RootStackParamList, typeof routes.cart>;
type CartEntry = ReturnType<typeof useCart>['entries'][number];

const Footer = styled.View(({ theme }) => ({
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.xxl,
  gap: theme.spacing.md,
  paddingHorizontal: theme.spacing.md
}));

interface CartEntryRowProps {
  entry: CartEntry;
  onIncrement: ReturnType<typeof useCart>['increment'];
  onDecrement: ReturnType<typeof useCart>['decrement'];
  onRemove: ReturnType<typeof useCart>['remove'];
}

const CartEntryRow: React.FC<CartEntryRowProps> = (props) => {
  const { entry, onIncrement, onDecrement, onRemove } = props;

  return (
    <React.Fragment key={entry.item.productId}>
      <CartItemRowActionBinder
        item={entry.item}
        product={entry.product}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
      />
      <Divider />
    </React.Fragment>
  );
};

interface CartFooterProps {
  pricing: CartPricingSummary;
  onCheckout: () => void;
}

const CartFooter: React.FC<CartFooterProps> = (props) => {
  const { pricing, onCheckout } = props;

  return (
    <Footer>
      <CartSummaryMemo pricing={pricing} />
      <Button label="Checkout" onPress={onCheckout} />
    </Footer>
  );
};

export const PopulatedCartContent: React.FC<PopulatedCartContentProps> = (props) => {
  const { navigation } = props;
  const cart = useCart();

  const checkout = useCallback(() => {
    navigation.navigate(routes.checkout);
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: CartEntry }) => <CartEntryRow entry={item} onIncrement={cart.increment} onDecrement={cart.decrement} onRemove={cart.remove} />,
    [cart.decrement, cart.increment, cart.remove]
  );

  const renderFooter = useCallback(
    () => <CartFooter pricing={cart.pricing} onCheckout={checkout} />,
    [cart.pricing, checkout]
  );

  return (
    <ScreenContent>
      <FlashList
        data={cart.entries}
        estimatedItemSize={96}
        renderItem={renderItem}
        keyExtractor={(entry) => entry.item.productId}
        ListFooterComponent={renderFooter}
      />
    </ScreenContent>
  );
};
