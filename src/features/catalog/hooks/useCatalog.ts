import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { catalogActions } from '../state/catalogSlice';
import {
  selectCatalogError,
  selectCatalogProducts,
  selectCatalogQuery,
  selectCatalogStatus,
  selectHasMoreProducts
} from '../state/catalogSelectors';

export const useCatalog = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectCatalogProducts);
  const status = useAppSelector(selectCatalogStatus);
  const error = useAppSelector(selectCatalogError);
  const query = useAppSelector(selectCatalogQuery);
  const hasMore = useAppSelector(selectHasMoreProducts);

  useEffect(() => {
    dispatch(catalogActions.catalogRequested('initial'));
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(catalogActions.catalogRequested('refresh'));
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (hasMore && status !== 'loading' && status !== 'refreshing' && status !== 'loadingMore') {
      dispatch(catalogActions.catalogRequested('loadMore'));
    }
  }, [dispatch, hasMore, status]);

  const retry = useCallback(() => {
    dispatch(catalogActions.catalogRequested(products.length > 0 ? 'refresh' : 'initial'));
  }, [dispatch, products.length]);

  const setQuery = useCallback(
    (nextQuery: string) => {
      dispatch(catalogActions.searchQueryChanged(nextQuery));
    },
    [dispatch]
  );

  return {
    products,
    status,
    error,
    query,
    hasMore,
    refresh,
    loadMore,
    retry,
    setQuery
  };
};
