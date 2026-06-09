import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store/rootReducer';

export const selectCheckoutState = (state: RootState) => state.checkout;
export const selectCheckoutStatus = createSelector(selectCheckoutState, (checkout) => checkout.status);
export const selectCheckoutError = createSelector(selectCheckoutState, (checkout) => checkout.error);
export const selectLatestOrderId = createSelector(selectCheckoutState, (checkout) => checkout.latestOrderId);
