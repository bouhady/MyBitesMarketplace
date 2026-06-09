import { marketplaceApi } from '../api/marketplaceApi';

export const ProductRepository = {
  listProducts: marketplaceApi.listProducts,
  getProductById: marketplaceApi.getProductById
};
