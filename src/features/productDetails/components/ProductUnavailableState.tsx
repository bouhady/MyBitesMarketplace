import React from 'react';
import { Button } from '../../../ui/components/Button';
import { ErrorState } from '../../../ui/components/ErrorState';
import { ScreenContent } from '../../../ui/components/Screen';

interface ProductUnavailableStateProps {
  error: string | null;
  onRetry: () => void;
  onBackToCatalog: () => void;
}

export const ProductUnavailableState = ({ error, onRetry, onBackToCatalog }: ProductUnavailableStateProps) => (
  <ScreenContent>
    <ErrorState title="Product unavailable" message={error ?? 'This product could not be found.'} onRetry={onRetry} />
    <Button label="Back to catalog" variant="secondary" onPress={onBackToCatalog} />
  </ScreenContent>
);
