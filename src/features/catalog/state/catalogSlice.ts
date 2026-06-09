import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../../domain/entities/Category';
import type { CategoryId, Product, ProductId } from '../../../domain/entities/Product';
import { defaultProductSort, type ProductSort } from '../../../domain/valueObjects/Sort';
import type { CatalogRequestMode, CatalogState } from './catalogTypes';

interface CatalogPagePayload {
  products: Product[];
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  mode: CatalogRequestMode;
}

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
  error: null
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
      if (action.payload === 'refresh') {
        state.status = 'refreshing';
      } else if (action.payload === 'loadMore') {
        state.status = 'loadingMore';
      } else {
        state.status = 'loading';
      }
    },
    catalogPageLoaded(state, action: PayloadAction<CatalogPagePayload>) {
      const shouldReplace = action.payload.mode !== 'loadMore';
      upsertProducts(state, action.payload.products, shouldReplace);
      state.categories = action.payload.categories;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.hasMore = action.payload.hasMore;
      state.status = 'success';
      state.error = null;
    },
    catalogFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
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
    productDetailsRequested(_state, _action: PayloadAction<ProductId>) {}
  }
});

export const catalogActions = catalogSlice.actions;
export const catalogReducer = catalogSlice.reducer;
