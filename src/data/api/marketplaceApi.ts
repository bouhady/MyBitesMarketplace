import type { Order } from '../../domain/entities/Order';
import type { Product } from '../../domain/entities/Product';
import { defaultProductSort } from '../../domain/valueObjects/Sort';
import { categoryDataset, productDataset } from '../mock/productDataset';
import { delay } from '../mock/delay';
import type { OrderApi, OrderRequest, ProductApi, ProductListRequest, ProductListResponse } from './marketplaceApi.types';

const normalize = (value: string): string => value.trim().toLowerCase();

const sortProducts = (products: Product[], sort: ProductListRequest['sort']): Product[] => {
  const sorted = [...products];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((left, right) => left.price.amount - right.price.amount);
    case 'price_desc':
      return sorted.sort((left, right) => right.price.amount - left.price.amount);
    case 'rating_desc':
      return sorted.sort((left, right) => right.rating.average - left.rating.average || right.rating.count - left.rating.count);
    default:
      return sorted;
  }
};

export const marketplaceApi: ProductApi & OrderApi = {
  async listProducts(request: ProductListRequest): Promise<ProductListResponse> {
    await delay();

    const query = normalize(request.query);
    const page = Math.max(1, request.page);
    const limit = Math.max(1, request.limit);
    const filtered = productDataset.filter((product) => {
      const matchesCategory = request.categoryId ? product.categoryId === request.categoryId : true;
      const matchesQuery = query
        ? normalize(`${product.title} ${product.description} ${product.metadata.sku}`).includes(query)
        : true;
      return matchesCategory && matchesQuery;
    });

    const sorted = sortProducts(filtered, request.sort ?? defaultProductSort);
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);

    return {
      items,
      categories: categoryDataset,
      page,
      limit,
      total: sorted.length,
      hasMore: start + items.length < sorted.length
    };
  },

  async getProductById(productId): Promise<Product | null> {
    await delay();
    return productDataset.find((product) => product.id === productId) ?? null;
  },

  async placeOrder(request: OrderRequest): Promise<Order> {
    await delay();

    if (request.items.length === 0) {
      throw new Error('Cart is empty.');
    }

    return {
      id: `order-${Date.now()}`,
      items: request.items,
      subtotal: request.pricing.subtotal,
      tax: request.pricing.tax,
      discount: request.pricing.discount,
      total: request.pricing.total,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
  }
};
