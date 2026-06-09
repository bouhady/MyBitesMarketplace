import { runSaga, stdChannel } from 'redux-saga';
import { OrderRepository } from '../../data/repositories/OrderRepository';
import { checkoutSaga } from '../../features/checkout/state/checkoutSaga';
import { checkoutActions } from '../../features/checkout/state/checkoutSlice';

describe('checkoutSaga', () => {
  afterEach(() => jest.restoreAllMocks());

  it('fails when there are no items', async () => {
    const channel = stdChannel();
    const dispatched: any[] = [];

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
          cart: { itemsByProductId: {} },
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
    const order = { id: 'o1' } as any;
    jest.spyOn(OrderRepository, 'placeOrder').mockResolvedValue(order);
    const dispatched: any[] = [];

    const state = {
      catalog: {
        ids: ['p1'],
        entities: { p1: { id: 'p1', title: 'P1', description: '', categoryId: '', price: { amount: 10, currency: 'USD' }, rating: { average: 0, count: 0 }, stock: { available: 10, reserved: 0 }, images: { thumbnailUrl: '', galleryUrls: [] }, metadata: { sku: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } },
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
      cart: { itemsByProductId: { p1: { productId: 'p1', quantity: 1, addedAt: 'now' } } },
      checkout: { status: 'idle', latestOrderId: null, error: null }
    } as any;

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
