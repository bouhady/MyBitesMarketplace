import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartState } from '../../features/cart/state/cartTypes';

const CART_STORAGE_KEY = 'my-bites-marketplace:cart';
type PersistedCartState = Pick<CartState, 'itemsByProductId'>;

const emptyCartState = (): CartState => ({
  itemsByProductId: {},
  hydrationStatus: 'idle',
  hydrationError: null
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseCartState = (value: string | null): CartState => {
  if (!value) {
    return emptyCartState();
  }

  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed) || !isRecord(parsed.itemsByProductId)) {
    return emptyCartState();
  }

  const itemsByProductId: CartState['itemsByProductId'] = {};
  Object.entries(parsed.itemsByProductId).forEach(([productId, item]) => {
    if (!isRecord(item)) {
      return;
    }

    const quantity = item.quantity;
    const addedAt = item.addedAt;
    const storedProductId = item.productId;

    if (storedProductId === productId && typeof quantity === 'number' && quantity > 0 && typeof addedAt === 'string') {
      itemsByProductId[productId] = {
        productId,
        quantity: Math.floor(quantity),
        addedAt
      };
    }
  });

  return {
    itemsByProductId,
    hydrationStatus: 'idle',
    hydrationError: null
  };
};

export const CartPersistenceRepository = {
  async loadCart(): Promise<CartState> {
    const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return parseCartState(storedCart);
  },

  async saveCart(cart: CartState): Promise<void> {
    const persistedCart: PersistedCartState = {
      itemsByProductId: cart.itemsByProductId
    };
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedCart));
  }
};
