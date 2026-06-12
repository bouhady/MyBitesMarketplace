import { runSaga, stdChannel } from 'redux-saga';
import type { Order } from '../../domain/entities/Order';
import { makeMoney } from '../../domain/valueObjects/Money';
import type { RootState } from '../../app/store/rootReducer';
import { OrderRepository } from '../../data/repositories/OrderRepository';
import { checkoutSaga } from '../../features/checkout/state/checkoutSaga';
import { checkoutActions } from '../../features/checkout/state/checkoutSlice';
import { productFactory } from '../factories/productFactory';

describe('checkoutSaga', () => {
  afterEach(() => jest.restoreAllMocks());

  it('fails when there are no items', async () => {
    const channel = stdChannel();
    const dispatched: unknown[] = [];

    const task = runSaga(
      {
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
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
          cart: { itemsByProductId: {}, hydrationStatus: 'success', hydrationError: null },
          checkout: { status: 'idle', latestOrderId: null, error: null }
        })
      },
      checkoutSaga
    );

    channel.put(checkoutActions.placeOrderRequested());
    await new Promise<void>((res) => setTimeout(res, 0));

    expect(dispatched).toContainEqual(checkoutActions.checkoutFailed('Add at least one item before checkout.'));
    task.cancel();
  });

  it('places order and clears cart on success', async () => {
    const channel = stdChannel();
    const order: Order = {
      id: 'o1',
      items: [{ productId: 'p1', quantity: 1, addedAt: 'now' }],
      subtotal: makeMoney(10),
      tax: makeMoney(0),
      discount: makeMoney(0),
      total: makeMoney(10),
      status: 'confirmed',
      createdAt: 'now'
    };
    jest.spyOn(OrderRepository, 'placeOrder').mockResolvedValue(order);
    const dispatched: unknown[] = [];

    const product = productFactory({ id: 'p1', title: 'P1' });
    const state: RootState = {
      catalog: {
        ids: ['p1'],
        entities: { p1: product },
        categories: [],
        page: 1,
        limit: 24,
        hasMore: false,
        total: 1,
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
        itemsByProductId: { p1: { productId: 'p1', quantity: 1, addedAt: 'now' } },
        hydrationStatus: 'success',
        hydrationError: null
      },
      checkout: { status: 'idle', latestOrderId: null, error: null }
    };

    const task = runSaga(
      {
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => state
      },
      checkoutSaga
    );

    channel.put(checkoutActions.placeOrderRequested());
    await new Promise<void>((res) => setTimeout(res, 0));

    expect(dispatched).toContainEqual(expect.objectContaining({ type: checkoutActions.orderPlaced.type }));
    expect(dispatched).toContainEqual(expect.objectContaining({ type: 'cart/cartCleared' }));
    task.cancel();
  });
});
