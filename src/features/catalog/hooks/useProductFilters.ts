import { useCallback } from 'react';
import type { CategoryId } from '../../../domain/entities/Product';
import type { ProductSort } from '../../../domain/valueObjects/Sort';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import {
  selectCatalogCategories,
  selectCatalogSort,
  selectSelectedCategoryId
} from '../state/catalogSelectors';
import { catalogActions } from '../state/catalogSlice';

export const useProductFilters = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCatalogCategories);
  const selectedCategoryId = useAppSelector(selectSelectedCategoryId);
  const sort = useAppSelector(selectCatalogSort);

  const selectCategory = useCallback(
    (categoryId: CategoryId | null) => {
      dispatch(catalogActions.categoryChanged(categoryId));
    },
    [dispatch]
  );

  const selectSort = useCallback(
    (nextSort: ProductSort) => {
      dispatch(catalogActions.sortChanged(nextSort));
    },
    [dispatch]
  );

  return { categories, selectedCategoryId, sort, selectCategory, selectSort };
};
