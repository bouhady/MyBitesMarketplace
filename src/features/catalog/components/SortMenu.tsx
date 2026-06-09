import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import type { ProductSort } from '../../../domain/valueObjects/Sort';
import { Chip } from '../../../ui/components/Chip';

const sortOptions: { label: string; value: ProductSort }[] = [
  { label: 'Rating', value: 'rating_desc' },
  { label: 'Price low', value: 'price_asc' },
  { label: 'Price high', value: 'price_desc' }
];

export const SortMenu = memo(({ value, onChange }: { value: ProductSort; onChange: (sort: ProductSort) => void }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {sortOptions.map((option) => (
      <Chip key={option.value} label={option.label} selected={value === option.value} onPress={() => onChange(option.value)} />
    ))}
  </ScrollView>
));
