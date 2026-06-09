import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import {
  selectCartItemsWithProducts,
  selectCartPricing,
  selectIsCartEmpty
} from '../state/cartSelectors';
import { cartActions } from '../state/cartSlice';
import type { Product } from '../../../domain/entities/Product';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectCartItemsWithProducts);
  const pricing = useAppSelector(selectCartPricing);
  const isEmpty = useAppSelector(selectIsCartEmpty);

  const increment = useCallback((product: Product) => dispatch(cartActions.incrementCartItem(product)), [dispatch]);
  const decrement = useCallback((product: Product) => dispatch(cartActions.decrementCartItem(product)), [dispatch]);
  const remove = useCallback((productId: string) => dispatch(cartActions.removeCartItem(productId)), [dispatch]);

  return { entries, pricing, isEmpty, increment, decrement, remove };
};
