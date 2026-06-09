import type { Money } from '../../domain/valueObjects/Money';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const formatMoney = (money: Money): string => formatter.format(money.amount);
