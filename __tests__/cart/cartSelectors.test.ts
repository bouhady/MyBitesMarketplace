import type { RootState } from '../../src/app/store/rootReducer';
import { selectCartPricing } from '../../src/features/cart/state/cartSelectors';
import { productFactory } from '../../src/test/factories/productFactory';
import { cartItemFactory } from '../../src/test/factories/cartFactory';

describe('cartSelectors', () => {
  it('calculates subtotal, tax, discount, total, and total items', () => {
    const product = productFactory({ price: { amount: 100, currency: 'USD' } });
    const state: RootState = {
      catalog: {
        ids: [product.id],
        entities: { [product.id]: product },
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
        itemsByProductId: {
          [product.id]: cartItemFactory({ productId: product.id, quantity: 2 })
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

    const pricing = selectCartPricing(state);

    expect(pricing.totalItems).toBe(2);
    expect(pricing.subtotal.amount).toBe(200);
    expect(pricing.discount.amount).toBe(10);
    expect(pricing.tax.amount).toBe(15.68);
    expect(pricing.total.amount).toBe(205.68);
  });
});
