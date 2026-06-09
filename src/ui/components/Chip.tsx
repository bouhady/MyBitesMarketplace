import React, { memo } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ChipFrame = styled(Pressable)<{ selected: boolean }>(({ theme, selected }) => ({
  height: 36,
  paddingHorizontal: theme.spacing.md,
  borderRadius: theme.radii.md,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: selected ? theme.colors.accent : theme.colors.surface,
  borderWidth: 1,
  borderColor: selected ? theme.colors.accent : theme.colors.border,
  marginRight: theme.spacing.sm
}));

const ChipLabel = styled.Text<{ selected: boolean }>(({ theme, selected }) => ({
  ...theme.typography.caption,
  color: selected ? theme.colors.accentText : theme.colors.textPrimary
}));

export const Chip = memo(({ label, selected, onPress }: ChipProps) => (
  <ChipFrame accessibilityRole="button" selected={selected} onPress={onPress}>
    <ChipLabel selected={selected}>{label}</ChipLabel>
  </ChipFrame>
));
