import type { CartItem } from '../../domain/entities/CartItem';
import type { Category } from '../../domain/entities/Category';
import type { Order } from '../../domain/entities/Order';
import type { CategoryId, Product, ProductId } from '../../domain/entities/Product';
import type { PageRequest, PageResult } from '../../domain/valueObjects/Pagination';
import type { ProductSort } from '../../domain/valueObjects/Sort';
import type { CartPricingSummary } from '../../domain/services/pricingRules';

export interface ProductListRequest extends PageRequest {
  query: string;
  categoryId: CategoryId | null;
  sort: ProductSort;
}

export interface ProductListResponse extends PageResult<Product> {
  categories: Category[];
}

export interface ProductApi {
  listProducts(request: ProductListRequest): Promise<ProductListResponse>;
  getProductById(productId: ProductId): Promise<Product | null>;
}

export interface OrderRequest {
  items: CartItem[];
  pricing: CartPricingSummary;
}

export interface OrderApi {
  placeOrder(request: OrderRequest): Promise<Order>;
}
