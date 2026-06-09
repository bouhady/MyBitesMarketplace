import React from 'react';
import { Button } from '../../../ui/components/Button';

export const PlaceOrderButton = ({ loading, onPress }: { loading: boolean; onPress: () => void }) => (
  <Button label="Place order" loading={loading} onPress={onPress} />
);
