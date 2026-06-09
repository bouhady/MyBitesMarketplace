import { combineReducers } from '@reduxjs/toolkit';
import { catalogReducer } from '../../features/catalog/state/catalogSlice';
import { cartReducer } from '../../features/cart/state/cartSlice';
import { checkoutReducer } from '../../features/checkout/state/checkoutSlice';

export const rootReducer = combineReducers({
  catalog: catalogReducer,
  cart: cartReducer,
  checkout: checkoutReducer
});

export type RootState = ReturnType<typeof rootReducer>;
