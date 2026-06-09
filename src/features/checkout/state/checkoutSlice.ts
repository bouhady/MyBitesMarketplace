import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '../../../domain/entities/Order';
import type { CheckoutState } from './checkoutTypes';

const initialState: CheckoutState = {
  status: 'idle',
  latestOrderId: null,
  error: null
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    placeOrderRequested(state) {
      state.status = 'loading';
      state.error = null;
    },
    orderPlaced(state, action: PayloadAction<Order>) {
      state.status = 'success';
      state.latestOrderId = action.payload.id;
      state.error = null;
    },
    checkoutFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    checkoutReset(state) {
      state.status = 'idle';
      state.latestOrderId = null;
      state.error = null;
    }
  }
});

export const checkoutActions = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
