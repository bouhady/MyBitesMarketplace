import { call, debounce, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { ProductRepository } from '../../../data/repositories/ProductRepository';
import type { ProductListResponse } from '../../../data/api/marketplaceApi.types';
import type { RootState } from '../../../app/store/rootReducer';
import { catalogActions } from './catalogSlice';
import type { CatalogRequestMode } from './catalogTypes';

const selectCatalogRequest = (state: RootState, mode: CatalogRequestMode) => {
  const nextPage = mode === 'loadMore' ? state.catalog.page + 1 : 1;
  return {
    page: nextPage,
    limit: state.catalog.limit,
    query: state.catalog.debouncedQuery,
    categoryId: state.catalog.selectedCategoryId,
    sort: state.catalog.sort
  };
};

function* requestCatalog(action: ReturnType<typeof catalogActions.catalogRequested>): SagaIterator {
  const mode = action.payload;
  const state: RootState = yield select();

  if (mode === 'loadMore' && !state.catalog.hasMore) {
    return;
  }

  try {
    const request: ReturnType<typeof selectCatalogRequest> = yield select(selectCatalogRequest, mode);
    const response: ProductListResponse = yield call(ProductRepository.listProducts, request);
    yield put(
      catalogActions.catalogPageLoaded({
        products: response.items,
        categories: response.categories,
        page: response.page,
        limit: response.limit,
        total: response.total,
        hasMore: response.hasMore,
        mode
      })
    );
  } catch (error: unknown) {
    yield put(catalogActions.catalogFailed(error instanceof Error ? error.message : 'Unable to load products.'));
  }
}

function* commitDebouncedSearch(action: ReturnType<typeof catalogActions.searchQueryChanged>): SagaIterator {
  yield put(catalogActions.debouncedSearchCommitted(action.payload));
  yield put(catalogActions.catalogRequested('initial'));
}

function* requestAfterFilterChange(): SagaIterator {
  yield put(catalogActions.catalogRequested('initial'));
}

function* requestProductDetails(action: ReturnType<typeof catalogActions.productDetailsRequested>): SagaIterator {
  const state: RootState = yield select();
  if (state.catalog.entities[action.payload]) {
    return;
  }

  try {
    const product: Awaited<ReturnType<typeof ProductRepository.getProductById>> = yield call(
      ProductRepository.getProductById,
      action.payload
    );
    if (product) {
      yield put(catalogActions.productUpserted(product));
    }
  } catch (error: unknown) {
    yield put(catalogActions.catalogFailed(error instanceof Error ? error.message : 'Unable to load product.'));
  }
}

export function* catalogSaga(): SagaIterator {
  yield debounce(350, catalogActions.searchQueryChanged.type, commitDebouncedSearch);
  yield takeLatest(catalogActions.categoryChanged.type, requestAfterFilterChange);
  yield takeLatest(catalogActions.sortChanged.type, requestAfterFilterChange);
  yield takeLatest(catalogActions.catalogRequested.type, requestCatalog);
  yield takeLatest(catalogActions.productDetailsRequested.type, requestProductDetails);
}
