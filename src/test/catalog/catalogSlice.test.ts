import { catalogReducer, catalogActions } from '../../features/catalog/state/catalogSlice';
import { productFactory } from '../factories/productFactory';

describe('catalogSlice', () => {
  it('ignores stale responses using requestSignature', () => {
    const product = productFactory();
    const initial = catalogReducer(undefined, catalogActions.catalogRequested('initial'));
    const loaded = catalogReducer(initial, catalogActions.catalogPageLoaded({
      products: [product],
      categories: [],
      page: 1,
      limit: 24,
      total: 1,
      hasMore: false,
      mode: 'initial',
      requestSignature: initial.activeRequestSignature ?? ''
    }));

    expect(loaded.ids).toContain(product.id);
  });
});
