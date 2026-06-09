import React, { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { BodyText, TitleText } from '../../../ui/components/Text';
import { useCheckout } from '../hooks/useCheckout';
import { CheckoutSummary } from '../components/CheckoutSummary';
import { PlaceOrderButton } from '../components/PlaceOrderButton';

type Props = NativeStackScreenProps<RootStackParamList, typeof routes.checkout>;

const Content = styled.View(({ theme }) => ({
  flex: 1,
  paddingVertical: theme.spacing.lg,
  gap: theme.spacing.lg
}));

export const CheckoutScreen = ({ navigation }: Props) => {
  const checkout = useCheckout();

  useEffect(() => {
    if (checkout.status === 'success') {
      navigation.replace(routes.orderSuccess);
    }
    if (checkout.status === 'error') {
      navigation.replace(routes.orderError);
    }
  }, [checkout.status, navigation]);

  return (
    <Screen>
      <ScreenContent>
        <Content>
          <TitleText>Checkout</TitleText>
          <BodyText>Review your order before placing it.</BodyText>
          <CheckoutSummary pricing={checkout.pricing} />
          <PlaceOrderButton loading={checkout.status === 'loading'} onPress={checkout.placeOrder} />
        </Content>
      </ScreenContent>
    </Screen>
  );
};
