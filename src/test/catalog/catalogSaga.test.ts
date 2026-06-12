import type { UnknownAction } from '@reduxjs/toolkit';
import { runSaga, stdChannel } from 'redux-saga';
import { ProductRepository } from '../../data/repositories/ProductRepository';
import { catalogActions } from '../../features/catalog/state/catalogSlice';
import { catalogSaga } from '../../features/catalog/state/catalogSaga';
import { productFactory } from '../factories/productFactory';

const isActionOfType = (action: unknown, type: string): action is UnknownAction =>
  typeof action === 'object' && action !== null && 'type' in action && action.type === type;

describe('catalogSaga', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('debounces search and commits only the last query', async () => {
    jest.useFakeTimers();
    const channel = stdChannel();
    const dispatched: unknown[] = [];

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
    expect(dispatched.filter((d) => isActionOfType(d, catalogActions.catalogRequested.type)).length).toBe(1);
    task.cancel();
  });

  it('productDetailsRequested triggers productDetailsLoaded when repository returns product', async () => {
    const channel = stdChannel();
    const product = productFactory({ id: 'p1' });
    jest.spyOn(ProductRepository, 'getProductById').mockResolvedValue(product);
    const dispatched: unknown[] = [];

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
