import { useCallback, useEffect, useMemo } from 'react';
import type { ProductId } from '../../../domain/entities/Product';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { catalogActions } from '../../catalog/state/catalogSlice';
import { selectProductById, selectProductDetailsError, selectProductDetailsStatus } from '../../catalog/state/catalogSelectors';

export const useProductDetails = (productId: ProductId) => {
  const dispatch = useAppDispatch();
  const selector = useMemo(() => selectProductById(productId), [productId]);
  const statusSelector = useMemo(() => selectProductDetailsStatus(productId), [productId]);
  const errorSelector = useMemo(() => selectProductDetailsError(productId), [productId]);
  const product = useAppSelector(selector);
  const status = useAppSelector(statusSelector);
  const error = useAppSelector(errorSelector);

  useEffect(() => {
    dispatch(catalogActions.productDetailsRequested(productId));
  }, [dispatch, productId]);

  const retry = useCallback(() => {
    dispatch(catalogActions.productDetailsRequested(productId));
  }, [dispatch, productId]);

  return { product, status, error, retry };
};
