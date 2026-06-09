import type { RootState } from '../../app/store/rootReducer';
import { selectCartItemsWithProducts, selectCartPricing } from '../../features/cart/state/cartSelectors';
import { cartItemFactory } from '../factories/cartFactory';

describe('selectCartItemsWithProducts (bug reproduction)', () => {
  it('filters out cart entries without loaded product entities while pricing still counts totalItems', () => {
    const productId = 'prod-1';

    const state: RootState = {
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
        status: 'idle',
        error: null,
        activeRequestSignature: null,
        productDetailsStatusById: {},
        productDetailsErrorById: {}
      },
      cart: {
        itemsByProductId: {
          [productId]: cartItemFactory({ productId, quantity: 3 })
        },
        hydrationStatus: 'success',
        hydrationError: null
      },
      checkout: {
        status: 'idle',
        latestOrderId: null,
        error: null
      }
    };

    const rows = selectCartItemsWithProducts(state);
    const pricing = selectCartPricing(state);

    expect(rows).toHaveLength(0);
    // Pricing now filters out unresolved items to match rendered rows
    expect(pricing.totalItems).toBe(0);
  });
});
