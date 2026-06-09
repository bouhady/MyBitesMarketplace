import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { Button } from '../../../ui/components/Button';
import { BodyText, TitleText } from '../../../ui/components/Text';
import { useCheckout } from '../hooks/useCheckout';

type Props = NativeStackScreenProps<RootStackParamList, typeof routes.orderError>;

const Content = styled.View(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md
}));

export const OrderErrorScreen = ({ navigation }: Props) => {
  const checkout = useCheckout();

  return (
    <Screen>
      <ScreenContent>
        <Content>
          <TitleText>Order failed</TitleText>
          <BodyText>{checkout.error ?? 'The order could not be placed.'}</BodyText>
          <Button
            label="Return to checkout"
            onPress={() => {
              checkout.resetCheckout();
              navigation.replace(routes.checkout);
            }}
          />
        </Content>
      </ScreenContent>
    </Screen>
  );
};
