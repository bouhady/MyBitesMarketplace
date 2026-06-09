import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { selectCartPricing } from '../../cart/state/cartSelectors';
import { checkoutActions } from '../state/checkoutSlice';
import {
  selectCheckoutError,
  selectCheckoutStatus,
  selectLatestOrderId
} from '../state/checkoutSelectors';

export const useCheckout = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCheckoutStatus);
  const error = useAppSelector(selectCheckoutError);
  const latestOrderId = useAppSelector(selectLatestOrderId);
  const pricing = useAppSelector(selectCartPricing);

  const placeOrder = useCallback(() => {
    dispatch(checkoutActions.placeOrderRequested());
  }, [dispatch]);

  const resetCheckout = useCallback(() => {
    dispatch(checkoutActions.checkoutReset());
  }, [dispatch]);

  return { status, error, latestOrderId, pricing, placeOrder, resetCheckout };
};
