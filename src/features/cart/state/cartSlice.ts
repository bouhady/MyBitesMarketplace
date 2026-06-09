import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../domain/entities/Product';
import { clampCartQuantity } from '../../../domain/services/cartRules';
import type { CartState } from './cartTypes';

interface AddToCartPayload {
  product: Product;
  quantity: number;
  addedAt: string;
}

const initialState: CartState = {
  itemsByProductId: {},
  hydrationStatus: 'idle',
  hydrationError: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { product, quantity, addedAt } = action.payload;
      const existing = state.itemsByProductId[product.id];
      const nextQuantity = clampCartQuantity((existing?.quantity ?? 0) + quantity, product);

      if (nextQuantity <= 0) {
        delete state.itemsByProductId[product.id];
        return;
      }

      state.itemsByProductId[product.id] = {
        productId: product.id,
        quantity: nextQuantity,
        addedAt: existing?.addedAt ?? addedAt
      };
    },
    cartHydrationRequested(state) {
      state.hydrationStatus = 'loading';
      state.hydrationError = null;
    },
    cartHydrated(state, action: PayloadAction<CartState>) {
      state.itemsByProductId = action.payload.itemsByProductId;
      state.hydrationStatus = 'success';
      state.hydrationError = null;
    },
    cartHydrationFailed(state, action: PayloadAction<string>) {
      state.itemsByProductId = {};
      state.hydrationStatus = 'error';
      state.hydrationError = action.payload;
    },
    incrementCartItem(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.itemsByProductId[product.id];
      if (!existing) {
        return;
      }
      existing.quantity = clampCartQuantity(existing.quantity + 1, product);
    },
    decrementCartItem(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.itemsByProductId[product.id];
      if (!existing) {
        return;
      }
      const nextQuantity = existing.quantity - 1;
      if (nextQuantity <= 0) {
        delete state.itemsByProductId[product.id];
        return;
      }
      existing.quantity = nextQuantity;
    },
    removeCartItem(state, action: PayloadAction<string>) {
      delete state.itemsByProductId[action.payload];
    },
    cartCleared(state) {
      state.itemsByProductId = {};
    }
  }
});

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
