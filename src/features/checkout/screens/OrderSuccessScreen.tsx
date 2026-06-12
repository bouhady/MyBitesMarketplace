import React, { useCallback } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { Button } from '../../../ui/components/Button';
import { BodyText, TitleText } from '../../../ui/components/Text';
import { useCheckout } from '../hooks/useCheckout';

type OrderSuccessScreenProps = NativeStackScreenProps<RootStackParamList, typeof routes.orderSuccess>;

const Content = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md
}));

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = (props) => {
  const { navigation } = props;
  const checkout = useCheckout();

  const backToMarketplace = useCallback(() => {
    checkout.resetCheckout();
    navigation.popToTop();
  }, [checkout, navigation]);

  return (
    <Screen>
      <ScreenContent>
        <Content>
          <TitleText>Order placed</TitleText>
          <BodyText>{checkout.latestOrderId ? `Confirmation ${checkout.latestOrderId}` : 'Your order is confirmed.'}</BodyText>
          <Button label="Back to marketplace" onPress={backToMarketplace} />
        </Content>
      </ScreenContent>
    </Screen>
  );
};
