import { useEffect, useMemo } from 'react';
import type { ProductId } from '../../../domain/entities/Product';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { catalogActions } from '../../catalog/state/catalogSlice';
import { selectProductById } from '../../catalog/state/catalogSelectors';

export const useProductDetails = (productId: ProductId) => {
  const dispatch = useAppDispatch();
  const selector = useMemo(() => selectProductById(productId), [productId]);
  const product = useAppSelector(selector);

  useEffect(() => {
    dispatch(catalogActions.productDetailsRequested(productId));
  }, [dispatch, productId]);

  return { product };
};
