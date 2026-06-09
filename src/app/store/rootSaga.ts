import { all } from 'redux-saga/effects';
import { catalogSaga } from '../../features/catalog/state/catalogSaga';
import { cartSaga } from '../../features/cart/state/cartSaga';
import { checkoutSaga } from '../../features/checkout/state/checkoutSaga';

export function* rootSaga() {
  yield all([catalogSaga(), cartSaga(), checkoutSaga()]);
}
