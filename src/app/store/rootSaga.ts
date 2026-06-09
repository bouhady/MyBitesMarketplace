import { all, fork } from 'redux-saga/effects';
import { catalogSaga } from '../../features/catalog/state/catalogSaga';
import { cartSaga } from '../../features/cart/state/cartSaga';
import { checkoutSaga } from '../../features/checkout/state/checkoutSaga';

export function* rootSaga() {
  yield all([fork(catalogSaga), fork(cartSaga), fork(checkoutSaga)]);
}
