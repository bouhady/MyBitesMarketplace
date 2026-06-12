import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen } from '../../../ui/components/Screen';
import { useCart } from '../hooks/useCart';
import { EmptyCartState } from '../components/EmptyCartState';
import { PopulatedCartContent } from '../components/PopulatedCartContent';

type CartScreenProps = NativeStackScreenProps<RootStackParamList, typeof routes.cart>;

export const CartScreen: React.FC<CartScreenProps> = (props) => {
  const cart = useCart();

  return (
    <Screen>
      {cart.isEmpty ? <EmptyCartState /> : <PopulatedCartContent {...props} />}
    </Screen>
  );
};
