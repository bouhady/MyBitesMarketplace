import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { OrderRepository } from '../../../data/repositories/OrderRepository';
import { cartActions } from '../../cart/state/cartSlice';
import { selectCartItems, selectCartPricing } from '../../cart/state/cartSelectors';
import { checkoutActions } from './checkoutSlice';
import type { CartItem } from '../../../domain/entities/CartItem';
import type { CartPricingSummary } from '../../../domain/services/pricingRules';
import type { Order } from '../../../domain/entities/Order';

function* placeOrder(): SagaIterator {
  const items: CartItem[] = yield select(selectCartItems);
  const pricing: CartPricingSummary = yield select(selectCartPricing);

  if (items.length === 0) {
    yield put(checkoutActions.checkoutFailed('Add at least one item before checkout.'));
    return;
  }

  try {
    const order: Order = yield call(OrderRepository.placeOrder, { items, pricing });
    yield put(checkoutActions.orderPlaced(order));
    yield put(cartActions.cartCleared());
  } catch (error: unknown) {
    yield put(checkoutActions.checkoutFailed(error instanceof Error ? error.message : 'Order could not be placed.'));
  }
}

export function* checkoutSaga(): SagaIterator {
  yield takeLatest(checkoutActions.placeOrderRequested.type, placeOrder);
}
