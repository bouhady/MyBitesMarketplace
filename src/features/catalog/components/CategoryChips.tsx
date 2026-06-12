import React, { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import type { Category } from '../../../domain/entities/Category';
import type { CategoryId } from '../../../domain/entities/Product';
import { ChipMemo } from '../../../ui/components/Chip';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId: CategoryId | null;
  onSelectCategory: (categoryId: CategoryId | null) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = (props) => {
  const { categories, selectedCategoryId, onSelectCategory } = props;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <CategoryChipBinder
        label="All"
        categoryId={null}
        selected={selectedCategoryId === null}
        onSelectCategory={onSelectCategory}
      />
      {categories.map((category) => (
        <CategoryChipBinder
          key={category.id}
          label={category.name}
          categoryId={category.id}
          selected={selectedCategoryId === category.id}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </ScrollView>
  );
};

export const CategoryChipsMemo = memo(CategoryChips);

interface CategoryChipBinderProps {
  label: string;
  categoryId: CategoryId | null;
  selected: boolean;
  onSelectCategory: (categoryId: CategoryId | null) => void;
}

export const CategoryChipBinder: React.FC<CategoryChipBinderProps> = (props) => {
  const { label, categoryId, selected, onSelectCategory } = props;

  const handlePress = useCallback(() => {
    onSelectCategory(categoryId);
  }, [categoryId, onSelectCategory]);

  return <ChipMemo label={label} selected={selected} onPress={handlePress} />;
};
