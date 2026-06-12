import React, { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import type { ProductSort } from '../../../domain/valueObjects/Sort';
import { ChipMemo } from '../../../ui/components/Chip';

const sortOptions: { label: string; value: ProductSort }[] = [
  { label: 'Rating', value: 'rating_desc' },
  { label: 'Price low', value: 'price_asc' },
  { label: 'Price high', value: 'price_desc' }
];

interface SortMenuProps {
  value: ProductSort;
  onChange: (sort: ProductSort) => void;
}

export const SortMenu: React.FC<SortMenuProps> = (props) => {
  const { value, onChange } = props;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {sortOptions.map((option) => (
        <SortOptionChipBinder
          key={option.value}
          label={option.label}
          value={option.value}
          selected={value === option.value}
          onChange={onChange}
        />
      ))}
    </ScrollView>
  );
};

export const SortMenuMemo = memo(SortMenu);

interface SortOptionChipBinderProps {
  label: string;
  value: ProductSort;
  selected: boolean;
  onChange: (sort: ProductSort) => void;
}

export const SortOptionChipBinder: React.FC<SortOptionChipBinderProps> = (props) => {
  const { label, value, selected, onChange } = props;

  const handlePress = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return <ChipMemo label={label} selected={selected} onPress={handlePress} />;
};
