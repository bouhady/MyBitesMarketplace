import styled from 'styled-components/native';

export const TitleText = styled.Text(({ theme }) => ({
  ...theme.typography.title,
  color: theme.colors.textPrimary
}));

export const SubtitleText = styled.Text(({ theme }) => ({
  ...theme.typography.subtitle,
  color: theme.colors.textPrimary
}));

export const BodyText = styled.Text(({ theme }) => ({
  ...theme.typography.body,
  color: theme.colors.textPrimary
}));

export const CaptionText = styled.Text(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.colors.textSecondary
}));
