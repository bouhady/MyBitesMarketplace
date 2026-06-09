import React from 'react';
import type { CartPricingSummary } from '../../../domain/services/pricingRules';
import { CartSummary } from '../../cart/components/CartSummary';

export const CheckoutSummary = ({ pricing }: { pricing: CartPricingSummary }) => <CartSummary pricing={pricing} />;
