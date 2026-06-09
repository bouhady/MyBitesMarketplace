import type { Category } from '../../domain/entities/Category';
import type { Product } from '../../domain/entities/Product';
import { makeMoney } from '../../domain/valueObjects/Money';
import { baseCategories } from './categoryDataset';

const adjectives = ['Crisp', 'Roasted', 'Fresh', 'Golden', 'Spiced', 'Creamy', 'Bright', 'Smoked'];
const nouns = ['Bites', 'Blend', 'Loaf', 'Bowl', 'Jar', 'Tart', 'Bundle', 'Plate'];

const imageFor = (index: number): string =>
  `https://picsum.photos/seed/mybites-product-${index}/640/480`;

export const generateProducts = (count = 2400): Product[] =>
  Array.from({ length: count }, (_, index) => {
    const category = baseCategories[index % baseCategories.length]!;
    const adjective = adjectives[index % adjectives.length];
    const noun = nouns[(index * 3) % nouns.length];
    const id = `product-${String(index + 1).padStart(5, '0')}`;
    const price = 4.5 + ((index * 37) % 950) / 10;
    const stock = (index * 11) % 38;
    const image = imageFor(index + 1);

    return {
      id,
      title: `${adjective} ${category.name} ${noun} ${index + 1}`,
      description: `A carefully sourced ${category.name.toLowerCase()} item prepared for fast marketplace browsing and realistic test data.`,
      categoryId: category.id,
      price: makeMoney(price),
      rating: {
        average: Number((3.2 + ((index * 17) % 19) / 10).toFixed(1)),
        count: 8 + ((index * 13) % 520)
      },
      stock: {
        available: stock,
        reserved: 0
      },
      images: {
        thumbnailUrl: image,
        galleryUrls: [image, imageFor(index + 5000), imageFor(index + 9000)]
      },
      metadata: {
        sku: `MB-${String(index + 1).padStart(6, '0')}`,
        createdAt: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString(),
        updatedAt: new Date(Date.UTC(2026, index % 6, (index % 27) + 1)).toISOString()
      }
    };
  });

export const productDataset: Product[] = generateProducts();

export const categoryDataset: Category[] = baseCategories.map((category) => ({
  ...category,
  productCount: productDataset.filter((product) => product.categoryId === category.id).length
}));
