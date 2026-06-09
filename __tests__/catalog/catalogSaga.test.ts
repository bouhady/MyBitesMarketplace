import { runSaga, stdChannel } from 'redux-saga';
import type { UnknownAction } from '@reduxjs/toolkit';
import { catalogSaga } from '../../src/features/catalog/state/catalogSaga';
import { catalogActions } from '../../src/features/catalog/state/catalogSlice';
import { ProductRepository } from '../../src/data/repositories/ProductRepository';
import type { RootState } from '../../src/app/store/rootReducer';

const baseState: RootState = {
  catalog: {
    ids: [],
    entities: {},
    categories: [],
    page: 1,
    limit: 24,
    hasMore: true,
    total: 0,
    query: '',
    debouncedQuery: '',
    selectedCategoryId: null,
    sort: 'rating_desc',
    status: 'idle',
    error: null
  },
  cart: { itemsByProductId: {}, hydrationStatus: 'idle', hydrationError: null },
  checkout: { status: 'idle', latestOrderId: null, error: null }
};

describe('catalogSaga', () => {
  it('debounces search and requests only the latest query', async () => {
    jest.useFakeTimers();
    const channel = stdChannel();
    const dispatched: ReturnType<typeof catalogActions.debouncedSearchCommitted>[] = [];
    const listSpy = jest.spyOn(ProductRepository, 'listProducts').mockResolvedValue({
      items: [],
      categories: [],
      page: 1,
      limit: 24,
      total: 0,
      hasMore: false
    });

    const task = runSaga(
      {
        channel,
        dispatch: (action: UnknownAction) => {
          if (catalogActions.debouncedSearchCommitted.match(action)) {
            dispatched.push(action);
          }
        },
        getState: () => ({ ...baseState, catalog: { ...baseState.catalog, debouncedQuery: 'coffee' } })
      },
      catalogSaga
    );

    channel.put(catalogActions.searchQueryChanged('co'));
    channel.put(catalogActions.searchQueryChanged('coffee'));
    jest.advanceTimersByTime(360);
    await Promise.resolve();

    expect(dispatched).toEqual([catalogActions.debouncedSearchCommitted('coffee')]);

    task.cancel();
    expect(listSpy).not.toHaveBeenCalledWith(expect.objectContaining({ query: 'co' }));
    listSpy.mockRestore();
    jest.useRealTimers();
  });
});
