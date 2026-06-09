import { createSelector } from '@reduxjs/toolkit';
import { calculateCartPricing } from '../../../domain/services/pricingRules';
import type { RootState } from '../../../app/store/rootReducer';
import { selectProductEntities } from '../../catalog/state/catalogSelectors';

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(selectCartState, (cart) => Object.values(cart.itemsByProductId));

export const selectCartItemsWithProducts = createSelector(
  selectCartItems,
  selectProductEntities,
  (items, productsById) =>
    items
      .map((item) => {
        const product = productsById[item.productId];
        return product ? { item, product } : null;
      })
      .filter((entry) => entry !== null)
);

export const selectCartPricing = createSelector(selectCartItems, selectProductEntities, calculateCartPricing);

export const selectCartSubtotal = createSelector(selectCartPricing, (pricing) => pricing.subtotal);
export const selectCartTax = createSelector(selectCartPricing, (pricing) => pricing.tax);
export const selectCartDiscount = createSelector(selectCartPricing, (pricing) => pricing.discount);
export const selectCartTotal = createSelector(selectCartPricing, (pricing) => pricing.total);
export const selectCartTotalItems = createSelector(selectCartPricing, (pricing) => pricing.totalItems);
export const selectIsCartEmpty = createSelector(selectCartTotalItems, (totalItems) => totalItems === 0);
