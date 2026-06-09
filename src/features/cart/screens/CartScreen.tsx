import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { Button } from '../../../ui/components/Button';
import { Divider } from '../../../ui/components/Divider';
import { useCart } from '../hooks/useCart';
import { CartItemRow } from '../components/CartItemRow';
import { CartSummary } from '../components/CartSummary';
import { EmptyCartState } from '../components/EmptyCartState';

type Props = NativeStackScreenProps<RootStackParamList, typeof routes.cart>;

const Content = styled.View(({ theme }) => ({
  paddingVertical: theme.spacing.lg,
  gap: theme.spacing.md
}));

export const CartScreen = ({ navigation }: Props) => {
  const cart = useCart();

  const checkout = useCallback(() => {
    navigation.navigate(routes.checkout);
  }, [navigation]);

  if (cart.isEmpty) {
    return (
      <Screen>
        <EmptyCartState />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenContent>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content>
            {cart.entries.map(({ item, product }) => (
              <React.Fragment key={item.productId}>
                <CartItemRow
                  item={item}
                  product={product}
                  onIncrement={cart.increment}
                  onDecrement={cart.decrement}
                  onRemove={cart.remove}
                />
                <Divider />
              </React.Fragment>
            ))}
            <CartSummary pricing={cart.pricing} />
            <Button label="Checkout" onPress={checkout} />
          </Content>
        </ScrollView>
      </ScreenContent>
    </Screen>
  );
};
