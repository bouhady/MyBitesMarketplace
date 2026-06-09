import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import {
  selectCartItemsWithProducts,
  selectCartPricing,
  selectIsCartEmpty
} from '../state/cartSelectors';
import { cartActions } from '../state/cartSlice';
import type { ProductId } from '../../../domain/entities/Product';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectCartItemsWithProducts);
  const pricing = useAppSelector(selectCartPricing);
  const isEmpty = useAppSelector(selectIsCartEmpty);

  const increment = useCallback((productId: ProductId) => dispatch(cartActions.incrementCartItem({ productId })), [dispatch]);
  const decrement = useCallback((productId: ProductId) => dispatch(cartActions.decrementCartItem({ productId })), [dispatch]);
  const remove = useCallback((productId: ProductId) => dispatch(cartActions.removeCartItem(productId)), [dispatch]);

  return { entries, pricing, isEmpty, increment, decrement, remove };
};
