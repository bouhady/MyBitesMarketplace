import React from 'react';
import type { CartPricingSummary } from '../../../domain/services/pricingRules';
import { CartSummaryMemo } from '../../cart/components/CartSummary';

interface CheckoutSummaryProps {
  pricing: CartPricingSummary;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = (props) => {
  const { pricing } = props;

  return <CartSummaryMemo pricing={pricing} />;
};
