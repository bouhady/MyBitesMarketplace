import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../../domain/entities/Category';
import type { CategoryId, Product, ProductId } from '../../../domain/entities/Product';
import { defaultProductSort, type ProductSort } from '../../../domain/valueObjects/Sort';
import type { CatalogRequestMode, CatalogRequestSignature, CatalogState } from './catalogTypes';

interface CatalogPagePayload {
  products: Product[];
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  mode: CatalogRequestMode;
  requestSignature: CatalogRequestSignature;
}

interface CatalogFailurePayload {
  error: string;
  requestSignature: CatalogRequestSignature;
}

interface CatalogRequestSnapshot {
  page: number;
  limit: number;
  query: string;
  categoryId: CategoryId | null;
  sort: ProductSort;
}

export const createCatalogRequestSignature = (request: CatalogRequestSnapshot): CatalogRequestSignature =>
  JSON.stringify(request);

const selectNextRequestSnapshot = (state: CatalogState, mode: CatalogRequestMode): CatalogRequestSnapshot => ({
  page: mode === 'loadMore' ? state.page + 1 : 1,
  limit: state.limit,
  query: state.debouncedQuery,
  categoryId: state.selectedCategoryId,
  sort: state.sort
});

const initialState: CatalogState = {
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
  sort: defaultProductSort,
  status: 'idle',
  error: null,
  activeRequestSignature: null,
  productDetailsStatusById: {},
  productDetailsErrorById: {}
};

const upsertProducts = (state: CatalogState, products: Product[], replace: boolean): void => {
  if (replace) {
    state.ids = [];
    state.entities = {};
  }

  products.forEach((product) => {
    state.entities[product.id] = product;
    if (!state.ids.includes(product.id)) {
      state.ids.push(product.id);
    }
  });
};

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    catalogRequested(state, action: PayloadAction<CatalogRequestMode>) {
      state.error = null;
      state.activeRequestSignature = createCatalogRequestSignature(selectNextRequestSnapshot(state, action.payload));
      if (action.payload === 'refresh') {
        state.status = 'refreshing';
      } else if (action.payload === 'loadMore') {
        state.status = 'loadingMore';
      } else {
        state.status = 'loading';
      }
    },
    catalogPageLoaded(state, action: PayloadAction<CatalogPagePayload>) {
      if (state.activeRequestSignature !== action.payload.requestSignature) {
        return;
      }
      const shouldReplace = action.payload.mode !== 'loadMore';
      upsertProducts(state, action.payload.products, shouldReplace);
      state.categories = action.payload.categories;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.hasMore = action.payload.hasMore;
      state.status = 'success';
      state.error = null;
      state.activeRequestSignature = null;
    },
    catalogFailed(state, action: PayloadAction<CatalogFailurePayload>) {
      if (state.activeRequestSignature !== action.payload.requestSignature) {
        return;
      }
      state.status = 'error';
      state.error = action.payload.error;
      state.activeRequestSignature = null;
    },
    searchQueryChanged(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    debouncedSearchCommitted(state, action: PayloadAction<string>) {
      state.debouncedQuery = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    categoryChanged(state, action: PayloadAction<CategoryId | null>) {
      state.selectedCategoryId = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    sortChanged(state, action: PayloadAction<ProductSort>) {
      state.sort = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    productUpserted(state, action: PayloadAction<Product>) {
      const product = action.payload;
      state.entities[product.id] = product;
      if (!state.ids.includes(product.id)) {
        state.ids.push(product.id);
      }
    },
    productDetailsRequested: {
      reducer(state, action: PayloadAction<ProductId>) {
        if (state.entities[action.payload]) {
          state.productDetailsStatusById[action.payload] = 'success';
          state.productDetailsErrorById[action.payload] = null;
          return;
        }
        state.productDetailsStatusById[action.payload] = 'loading';
        state.productDetailsErrorById[action.payload] = null;
      },
      prepare(productId: ProductId) {
        return { payload: productId };
      }
    },
    productDetailsLoaded(state, action: PayloadAction<Product>) {
      const product = action.payload;
      state.entities[product.id] = product;
      if (!state.ids.includes(product.id)) {
        state.ids.push(product.id);
      }
      state.productDetailsStatusById[product.id] = 'success';
      state.productDetailsErrorById[product.id] = null;
    },
    productDetailsFailed(state, action: PayloadAction<{ productId: ProductId; error: string }>) {
      state.productDetailsStatusById[action.payload.productId] = 'error';
      state.productDetailsErrorById[action.payload.productId] = action.payload.error;
    }
  }
});

export const catalogActions = catalogSlice.actions;
export const catalogReducer = catalogSlice.reducer;
