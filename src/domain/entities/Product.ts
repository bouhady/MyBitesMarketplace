import type { Money } from '../valueObjects/Money';

export type ProductId = string;
export type CategoryId = string;

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductStock {
  available: number;
  reserved: number;
}

export interface ProductImages {
  thumbnailUrl: string;
  galleryUrls: string[];
}

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  categoryId: CategoryId;
  price: Money;
  rating: ProductRating;
  stock: ProductStock;
  images: ProductImages;
  metadata: {
    sku: string;
    createdAt: string;
    updatedAt: string;
  };
}
