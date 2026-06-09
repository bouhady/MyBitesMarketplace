import { runSaga, stdChannel } from 'redux-saga';
import { ProductRepository } from '../../data/repositories/ProductRepository';
import { catalogActions } from '../../features/catalog/state/catalogSlice';
import { catalogSaga } from '../../features/catalog/state/catalogSaga';

describe('catalogSaga', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('debounces search and commits only the last query', async () => {
    jest.useFakeTimers();
    const channel = stdChannel();
    const dispatched: any[] = [];

    const task = runSaga(
      {
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ catalog: { debouncedQuery: '', page: 1, limit: 24, selectedCategoryId: null, sort: 'rating_desc' } })
      },
      catalogSaga
    );

    channel.put(catalogActions.searchQueryChanged('one'));
    channel.put(catalogActions.searchQueryChanged('two'));
    jest.advanceTimersByTime(360);
    await Promise.resolve();

    // catalogRequested should be dispatched once, with the last query committed
    expect(dispatched.filter((d) => d.type === catalogActions.catalogRequested.type).length).toBe(1);
    task.cancel();
  });

  it('productDetailsRequested triggers productDetailsLoaded when repository returns product', async () => {
    const channel = stdChannel();
    const product = { id: 'p1' } as any;
    jest.spyOn(ProductRepository, 'getProductById').mockResolvedValue(product);
    const dispatched: any[] = [];

    const task = runSaga(
      {
        channel,
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ catalog: { entities: {} } })
      },
      catalogSaga
    );

    channel.put(catalogActions.productDetailsRequested('p1'));
    await Promise.resolve();

    expect(dispatched).toContainEqual(catalogActions.productDetailsLoaded(product));
    task.cancel();
  });
});
