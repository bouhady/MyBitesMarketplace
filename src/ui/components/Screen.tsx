import styled from 'styled-components/native';

export const Screen = styled.SafeAreaView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background
}));

export const ScreenContent = styled.View(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.spacing.lg
}));
