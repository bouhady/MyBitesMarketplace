import React from 'react';
import { Button } from '../../../ui/components/Button';
import { ErrorState } from '../../../ui/components/ErrorState';
import { ScreenContent } from '../../../ui/components/Screen';

interface ProductUnavailableStateProps {
  error: string | null;
  onRetry: () => void;
  onBackToCatalog: () => void;
}

export const ProductUnavailableState: React.FC<ProductUnavailableStateProps> = (props) => {
  const { error, onRetry, onBackToCatalog } = props;

  return (
    <ScreenContent>
      <ErrorState title="Product unavailable" message={error ?? 'This product could not be found.'} onRetry={onRetry} />
      <Button label="Back to catalog" variant="secondary" onPress={onBackToCatalog} />
    </ScreenContent>
  );
};
