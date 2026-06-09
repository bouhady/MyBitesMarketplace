import type { Product } from '../../domain/entities/Product';
import { makeMoney } from '../../domain/valueObjects/Money';

export const productFactory = (overrides: Partial<Product> = {}): Product => ({
  id: 'product-test',
  title: 'Fresh Test Bites',
  description: 'A test product.',
  categoryId: 'bakery',
  price: makeMoney(10),
  rating: {
    average: 4.8,
    count: 24
  },
  stock: {
    available: 5,
    reserved: 0
  },
  images: {
    thumbnailUrl: 'https://example.com/thumb.jpg',
    galleryUrls: ['https://example.com/thumb.jpg']
  },
  metadata: {
    sku: 'TEST-001',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  ...overrides
});
