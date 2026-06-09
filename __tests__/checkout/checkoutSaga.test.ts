import { runSaga, stdChannel } from 'redux-saga';
import type { UnknownAction } from '@reduxjs/toolkit';
import { checkoutActions } from '../../src/features/checkout/state/checkoutSlice';
import { checkoutSaga } from '../../src/features/checkout/state/checkoutSaga';
import type { RootState } from '../../src/app/store/rootReducer';

describe('checkoutSaga', () => {
  it('fails gracefully when placing an empty order', async () => {
    const channel = stdChannel();
    const dispatched: UnknownAction[] = [];
    const state: RootState = {
      catalog: {
        ids: [],
        entities: {},
        categories: [],
        page: 1,
        limit: 24,
        hasMore: false,
        total: 0,
        query: '',
        debouncedQuery: '',
        selectedCategoryId: null,
        sort: 'rating_desc',
        status: 'success',
        error: null,
        activeRequestSignature: null,
        productDetailsStatusById: {},
        productDetailsErrorById: {}
      },
      cart: { itemsByProductId: {}, hydrationStatus: 'idle', hydrationError: null },
      checkout: { status: 'idle', latestOrderId: null, error: null }
    };

    const task = runSaga(
      {
        channel,
        dispatch: (action: UnknownAction) => dispatched.push(action),
        getState: () => state
      },
      checkoutSaga
    );

    channel.put(checkoutActions.placeOrderRequested());
    await Promise.resolve();

    expect(dispatched).toContainEqual(checkoutActions.checkoutFailed('Add at least one item before checkout.'));
    task.cancel();
  });
});
