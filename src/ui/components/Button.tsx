import React, { memo, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import styled from 'styled-components/native';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
}

const ButtonFrame = styled(Pressable)<{ variant: ButtonVariant; disabledState: boolean }>(({ theme, variant, disabledState }) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return {
    minHeight: 48,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: isDanger ? theme.colors.danger : isPrimary ? theme.colors.accent : theme.colors.surface,
    borderWidth: isPrimary || isDanger ? 0 : 1,
    borderColor: theme.colors.border,
    opacity: disabledState ? 0.5 : 1
  };
});

const ButtonLabel = styled.Text<{ variant: ButtonVariant }>(({ theme, variant }) => ({
  ...theme.typography.button,
  color: variant === 'primary' || variant === 'danger' ? theme.colors.accentText : theme.colors.textPrimary
}));

export const Button = memo(({ label, variant = 'primary', loading = false, disabled = false, icon, ...props }: ButtonProps) => (
  <ButtonFrame accessibilityRole="button" variant={variant} disabledState={disabled || loading} disabled={disabled || loading} {...props}>
    {loading ? <ActivityIndicator color={variant === 'secondary' ? '#1F2421' : '#FFFFFF'} /> : icon}
    <ButtonLabel variant={variant}>{label}</ButtonLabel>
  </ButtonFrame>
));
