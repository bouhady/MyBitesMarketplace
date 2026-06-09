import { catalogActions, catalogReducer, createCatalogRequestSignature } from '../../src/features/catalog/state/catalogSlice';
import type { CatalogState } from '../../src/features/catalog/state/catalogTypes';
import { productFactory } from '../../src/test/factories/productFactory';

const initialCatalogState = (): CatalogState => ({
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
  error: null,
  activeRequestSignature: null,
  productDetailsStatusById: {},
  productDetailsErrorById: {}
});

describe('catalogSlice', () => {
  it('ignores stale catalog page responses', () => {
    const latestProduct = productFactory({ id: 'latest-product' });
    const staleProduct = productFactory({ id: 'stale-product' });
    let state = catalogReducer(initialCatalogState(), catalogActions.catalogRequested('initial'));
    const staleSignature = state.activeRequestSignature;

    state = catalogReducer(state, catalogActions.searchQueryChanged('latest'));
    state = catalogReducer(state, catalogActions.debouncedSearchCommitted('latest'));
    state = catalogReducer(state, catalogActions.catalogRequested('initial'));
    const latestSignature = state.activeRequestSignature;

    state = catalogReducer(
      state,
      catalogActions.catalogPageLoaded({
        products: [staleProduct],
        categories: [],
        page: 1,
        limit: 24,
        total: 1,
        hasMore: false,
        mode: 'initial',
        requestSignature: staleSignature ?? ''
      })
    );

    expect(state.ids).toEqual([]);
    expect(state.status).toBe('loading');

    state = catalogReducer(
      state,
      catalogActions.catalogPageLoaded({
        products: [latestProduct],
        categories: [],
        page: 1,
        limit: 24,
        total: 1,
        hasMore: false,
        mode: 'initial',
        requestSignature: latestSignature ?? ''
      })
    );

    expect(state.ids).toEqual([latestProduct.id]);
    expect(state.entities[latestProduct.id]).toEqual(latestProduct);
    expect(state.status).toBe('success');
  });

  it('keeps product detail failures separate from catalog list status', () => {
    const state = catalogReducer(
      { ...initialCatalogState(), status: 'success' },
      catalogActions.productDetailsFailed({ productId: 'missing-product', error: 'Product not found.' })
    );

    expect(state.status).toBe('success');
    expect(state.error).toBeNull();
    expect(state.productDetailsStatusById['missing-product']).toBe('error');
    expect(state.productDetailsErrorById['missing-product']).toBe('Product not found.');
  });

  it('creates stable signatures for equivalent catalog requests', () => {
    expect(
      createCatalogRequestSignature({
        page: 1,
        limit: 24,
        query: 'toast',
        categoryId: null,
        sort: 'rating_desc'
      })
    ).toBe(
      createCatalogRequestSignature({
        page: 1,
        limit: 24,
        query: 'toast',
        categoryId: null,
        sort: 'rating_desc'
      })
    );
  });
});
