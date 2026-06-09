import { cartActions, cartReducer } from '../../src/features/cart/state/cartSlice';
import { productFactory } from '../../src/test/factories/productFactory';

describe('cartSlice', () => {
  it('adds items and clamps at available stock', () => {
    const product = productFactory({ stock: { available: 2, reserved: 0 } });
    const first = cartReducer(undefined, cartActions.addToCart({ product, quantity: 1, addedAt: 'now' }));
    const second = cartReducer(first, cartActions.addToCart({ product, quantity: 5, addedAt: 'later' }));

    expect(second.itemsByProductId[product.id]?.quantity).toBe(2);
    expect(second.itemsByProductId[product.id]?.addedAt).toBe('now');
  });

  it('decrements to removal without corrupting other items', () => {
    const product = productFactory();
    const added = cartReducer(undefined, cartActions.addToCart({ product, quantity: 1, addedAt: 'now' }));
    const removed = cartReducer(added, cartActions.decrementCartItem(product));

    expect(removed.itemsByProductId[product.id]).toBeUndefined();
  });
});
