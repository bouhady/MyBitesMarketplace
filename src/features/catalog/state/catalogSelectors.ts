import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store/rootReducer';

export const selectCatalogState = (state: RootState) => state.catalog;
export const selectProductEntities = createSelector(selectCatalogState, (catalog) => catalog.entities);
export const selectCatalogStatus = createSelector(selectCatalogState, (catalog) => catalog.status);
export const selectCatalogError = createSelector(selectCatalogState, (catalog) => catalog.error);
export const selectCatalogQuery = createSelector(selectCatalogState, (catalog) => catalog.query);
export const selectCatalogCategories = createSelector(selectCatalogState, (catalog) => catalog.categories);
export const selectSelectedCategoryId = createSelector(selectCatalogState, (catalog) => catalog.selectedCategoryId);
export const selectCatalogSort = createSelector(selectCatalogState, (catalog) => catalog.sort);
export const selectHasMoreProducts = createSelector(selectCatalogState, (catalog) => catalog.hasMore);
export const selectProductDetailsStatusById = createSelector(selectCatalogState, (catalog) => catalog.productDetailsStatusById);
export const selectProductDetailsErrorById = createSelector(selectCatalogState, (catalog) => catalog.productDetailsErrorById);

export const selectCatalogProducts = createSelector(selectCatalogState, (catalog) =>
  catalog.ids.map((id) => catalog.entities[id]).filter((product) => product !== undefined)
);

export const selectProductById = (productId: string) =>
  createSelector(selectProductEntities, (entities) => entities[productId] ?? null);

export const selectProductDetailsStatus = (productId: string) =>
  createSelector(selectProductDetailsStatusById, (statusById) => statusById[productId] ?? 'idle');

export const selectProductDetailsError = (productId: string) =>
  createSelector(selectProductDetailsErrorById, (errorById) => errorById[productId] ?? null);
