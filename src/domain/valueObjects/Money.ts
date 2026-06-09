export type CurrencyCode = 'USD';

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export const makeMoney = (amount: number, currency: CurrencyCode = 'USD'): Money => ({
  amount: Number(amount.toFixed(2)),
  currency
});
