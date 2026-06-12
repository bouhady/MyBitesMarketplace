import React from 'react';
import { Button } from '../../../ui/components/Button';

interface PlaceOrderButtonProps {
  loading: boolean;
  onPress: () => void;
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = (props) => {
  const { loading, onPress } = props;

  return <Button label="Place order" loading={loading} onPress={onPress} />;
};
