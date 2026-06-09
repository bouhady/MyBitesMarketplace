import type { Category } from '../../domain/entities/Category';

export const baseCategories: Omit<Category, 'productCount'>[] = [
  { id: 'bakery', name: 'Bakery', slug: 'bakery' },
  { id: 'coffee', name: 'Coffee', slug: 'coffee' },
  { id: 'produce', name: 'Produce', slug: 'produce' },
  { id: 'pantry', name: 'Pantry', slug: 'pantry' },
  { id: 'prepared', name: 'Prepared', slug: 'prepared' },
  { id: 'dessert', name: 'Dessert', slug: 'dessert' }
];
