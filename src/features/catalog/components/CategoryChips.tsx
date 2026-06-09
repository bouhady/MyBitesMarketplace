import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import type { Category } from '../../../domain/entities/Category';
import type { CategoryId } from '../../../domain/entities/Product';
import { Chip } from '../../../ui/components/Chip';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId: CategoryId | null;
  onSelectCategory: (categoryId: CategoryId | null) => void;
}

export const CategoryChips = memo(({ categories, selectedCategoryId, onSelectCategory }: CategoryChipsProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <Chip label="All" selected={selectedCategoryId === null} onPress={() => onSelectCategory(null)} />
    {categories.map((category) => (
      <Chip
        key={category.id}
        label={category.name}
        selected={selectedCategoryId === category.id}
        onPress={() => onSelectCategory(category.id)}
      />
    ))}
  </ScrollView>
));
