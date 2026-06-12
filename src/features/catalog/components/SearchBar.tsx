import React, { memo } from 'react';
import styled from 'styled-components/native';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

const Input = styled.TextInput(({ theme }) => ({
  height: 48,
  borderRadius: theme.radii.md,
  backgroundColor: theme.colors.surface,
  borderWidth: 1,
  borderColor: theme.colors.border,
  paddingHorizontal: theme.spacing.lg,
  color: theme.colors.textPrimary,
  ...theme.typography.body
}));

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { value, onChangeText } = props;

  return (
    <Input
      accessibilityLabel="Search products"
      placeholder="Search products"
      placeholderTextColor="#66706A"
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      clearButtonMode="while-editing"
    />
  );
};

export const SearchBarMemo = memo(SearchBar);
