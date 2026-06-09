import { call, debounce, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { CartPersistenceRepository } from '../../../data/repositories/CartPersistenceRepository';
import type { RootState } from '../../../app/store/rootReducer';
import type { CartState, PersistableCartState } from './cartTypes';
import { cartActions } from './cartSlice';
import { selectPersistableCartState } from './cartSelectors';

const selectProductIncrementContext = (state: RootState, productId: string) => ({
  item: state.cart.itemsByProductId[productId],
  product: state.catalog.entities[productId]
});

function* hydrateCart(): SagaIterator {
  try {
    const cart: CartState = yield call(CartPersistenceRepository.loadCart);
    yield put(cartActions.cartHydrated(cart));
  } catch (error: unknown) {
    yield put(cartActions.cartHydrationFailed(error instanceof Error ? error.message : 'Unable to restore cart.'));
  }
}

function* persistCart(): SagaIterator {
  try {
    const cart: PersistableCartState = yield select(selectPersistableCartState);
    yield call(CartPersistenceRepository.saveCart, cart);
  } catch (error: unknown) {
    console.error('Unable to persist cart.', error);
  }
}

function* incrementCartItem(action: ReturnType<typeof cartActions.incrementCartItem>): SagaIterator {
  const context: ReturnType<typeof selectProductIncrementContext> = yield select(
    selectProductIncrementContext,
    action.payload.productId
  );

  if (!context.item || !context.product) {
    return;
  }

  yield put(
    cartActions.cartItemIncremented({
      productId: action.payload.productId,
      maxQuantity: context.product.stock.available
    })
  );
}

export function* cartSaga(): SagaIterator {
  yield takeLatest(cartActions.cartHydrationRequested.type, hydrateCart);
  yield takeEvery(cartActions.incrementCartItem.type, incrementCartItem);
  yield debounce(
    250,
    [
      cartActions.addToCart.type,
      cartActions.cartItemIncremented.type,
      cartActions.decrementCartItem.type,
      cartActions.removeCartItem.type,
      cartActions.cartCleared.type
    ],
    persistCart
  );
}
