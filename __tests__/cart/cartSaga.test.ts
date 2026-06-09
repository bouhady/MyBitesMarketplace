import { runSaga, stdChannel } from 'redux-saga';
import type { UnknownAction } from '@reduxjs/toolkit';
import { cartActions } from '../../src/features/cart/state/cartSlice';
import { cartSaga } from '../../src/features/cart/state/cartSaga';
import { CartPersistenceRepository } from '../../src/data/repositories/CartPersistenceRepository';
import type { RootState } from '../../src/app/store/rootReducer';
import { cartItemFactory } from '../../src/test/factories/cartFactory';

const emptyState: RootState = {
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
    error: null
  },
  cart: {
    itemsByProductId: {},
    hydrationStatus: 'idle',
    hydrationError: null
  },
  checkout: {
    status: 'idle',
    latestOrderId: null,
    error: null
  }
};

describe('cartSaga', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('hydrates persisted cart state', async () => {
    const channel = stdChannel();
    const hydratedCart = {
      itemsByProductId: {
        'product-test': cartItemFactory()
      },
      hydrationStatus: 'idle' as const,
      hydrationError: null
    };
    const dispatched: UnknownAction[] = [];
    jest.spyOn(CartPersistenceRepository, 'loadCart').mockResolvedValue(hydratedCart);

    const task = runSaga(
      {
        channel,
        dispatch: (action: UnknownAction) => dispatched.push(action),
        getState: () => emptyState
      },
      cartSaga
    );

    channel.put(cartActions.cartHydrationRequested());
    await Promise.resolve();

    expect(dispatched).toContainEqual(cartActions.cartHydrated(hydratedCart));
    task.cancel();
  });

  it('falls back cleanly when hydration fails', async () => {
    const channel = stdChannel();
    const dispatched: UnknownAction[] = [];
    jest.spyOn(CartPersistenceRepository, 'loadCart').mockRejectedValue(new Error('storage unavailable'));

    const task = runSaga(
      {
        channel,
        dispatch: (action: UnknownAction) => dispatched.push(action),
        getState: () => emptyState
      },
      cartSaga
    );

    channel.put(cartActions.cartHydrationRequested());
    await Promise.resolve();

    expect(dispatched).toContainEqual(cartActions.cartHydrationFailed('storage unavailable'));
    task.cancel();
  });

  it('debounces cart persistence after mutations', async () => {
    jest.useFakeTimers();
    const channel = stdChannel();
    const state: RootState = {
      ...emptyState,
      cart: {
        itemsByProductId: {
          'product-test': cartItemFactory()
        },
        hydrationStatus: 'success',
        hydrationError: null
      }
    };
    const saveSpy = jest.spyOn(CartPersistenceRepository, 'saveCart').mockResolvedValue();

    const task = runSaga(
      {
        channel,
        dispatch: jest.fn(),
        getState: () => state
      },
      cartSaga
    );

    channel.put(cartActions.removeCartItem('first'));
    channel.put(cartActions.removeCartItem('second'));
    jest.advanceTimersByTime(260);
    await Promise.resolve();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(state.cart);
    task.cancel();
  });
});
