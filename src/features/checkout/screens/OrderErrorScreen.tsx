import React, { useCallback } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { Button } from '../../../ui/components/Button';
import { BodyText, TitleText } from '../../../ui/components/Text';
import { useCheckout } from '../hooks/useCheckout';

type OrderErrorScreenProps = NativeStackScreenProps<RootStackParamList, typeof routes.orderError>;

const Content = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md
}));

export const OrderErrorScreen: React.FC<OrderErrorScreenProps> = (props) => {
  const { navigation } = props;
  const checkout = useCheckout();

  const returnToCheckout = useCallback(() => {
    checkout.resetCheckout();
    navigation.replace(routes.checkout);
  }, [checkout, navigation]);

  return (
    <Screen>
      <ScreenContent>
        <Content>
          <TitleText>Order failed</TitleText>
          <BodyText>{checkout.error ?? 'The order could not be placed.'}</BodyText>
          <Button label="Return to checkout" onPress={returnToCheckout} />
        </Content>
      </ScreenContent>
    </Screen>
  );
};
