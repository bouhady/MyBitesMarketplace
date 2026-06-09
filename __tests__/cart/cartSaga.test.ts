import { runSaga, stdChannel } from 'redux-saga';
import type { UnknownAction } from '@reduxjs/toolkit';
import { cartActions } from '../../src/features/cart/state/cartSlice';
import { cartSaga } from '../../src/features/cart/state/cartSaga';
import { CartPersistenceRepository } from '../../src/data/repositories/CartPersistenceRepository';
import type { RootState } from '../../src/app/store/rootReducer';
import { cartItemFactory } from '../../src/test/factories/cartFactory';
import { productFactory } from '../../src/test/factories/productFactory';

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
    error: null,
    activeRequestSignature: null,
    productDetailsStatusById: {},
    productDetailsErrorById: {}
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
    expect(saveSpy).toHaveBeenCalledWith({ itemsByProductId: state.cart.itemsByProductId });
    task.cancel();
  });

  it('clamps increment requests using current catalog product data', async () => {
    const product = productFactory({ stock: { available: 2, reserved: 0 } });
    const channel = stdChannel();
    const dispatched: UnknownAction[] = [];
    const state: RootState = {
      ...emptyState,
      catalog: {
        ...emptyState.catalog,
        ids: [product.id],
        entities: { [product.id]: product }
      },
      cart: {
        itemsByProductId: {
          [product.id]: cartItemFactory({ productId: product.id, quantity: 1 })
        },
        hydrationStatus: 'success',
        hydrationError: null
      }
    };

    const task = runSaga(
      {
        channel,
        dispatch: (action: UnknownAction) => dispatched.push(action),
        getState: () => state
      },
      cartSaga
    );

    channel.put(cartActions.incrementCartItem({ productId: product.id }));
    await Promise.resolve();

    expect(dispatched).toContainEqual(cartActions.cartItemIncremented({ productId: product.id, maxQuantity: 2 }));
    task.cancel();
  });

  it('keeps persistence watcher alive after save failures', async () => {
    jest.useFakeTimers();
    const channel = stdChannel();
    const saveSpy = jest
      .spyOn(CartPersistenceRepository, 'saveCart')
      .mockRejectedValueOnce(new Error('storage unavailable'))
      .mockResolvedValueOnce();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const task = runSaga(
      {
        channel,
        dispatch: jest.fn(),
        getState: () => emptyState
      },
      cartSaga
    );

    channel.put(cartActions.removeCartItem('first'));
    jest.advanceTimersByTime(260);
    await Promise.resolve();

    channel.put(cartActions.removeCartItem('second'));
    jest.advanceTimersByTime(260);
    await Promise.resolve();

    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Unable to persist cart.', expect.any(Error));
    task.cancel();
  });
});
