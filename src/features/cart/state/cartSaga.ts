import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { CartPersistenceRepository } from '../../../data/repositories/CartPersistenceRepository';
import type { RootState } from '../../../app/store/rootReducer';
import type { CartState } from './cartTypes';
import { cartActions } from './cartSlice';

const selectCartState = (state: RootState) => state.cart;

function* hydrateCart(): SagaIterator {
  try {
    const cart: CartState = yield call(CartPersistenceRepository.loadCart);
    yield put(cartActions.cartHydrated(cart));
  } catch (error: unknown) {
    yield put(cartActions.cartHydrationFailed(error instanceof Error ? error.message : 'Unable to restore cart.'));
  }
}

function* persistCart(): SagaIterator {
  const cart: CartState = yield select(selectCartState);
  yield call(CartPersistenceRepository.saveCart, cart);
}

export function* cartSaga(): SagaIterator {
  yield takeLatest(cartActions.cartHydrationRequested.type, hydrateCart);
  yield debounce(
    250,
    [
      cartActions.addToCart.type,
      cartActions.incrementCartItem.type,
      cartActions.decrementCartItem.type,
      cartActions.removeCartItem.type,
      cartActions.cartCleared.type
    ],
    persistCart
  );
}
