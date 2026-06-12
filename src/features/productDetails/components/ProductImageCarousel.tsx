import React from 'react';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { getCachePolicy } from '../../../shared/utils/imageCache';

const ProductImage = styled(Image)(({ theme }) => ({
  width: 312,
  height: 240,
  borderRadius: theme.radii.md,
  marginRight: theme.spacing.md,
  backgroundColor: theme.colors.surfaceMuted
}));

interface ProductImageCarouselProps {
  urls: string[];
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = (props) => {
  const { urls } = props;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {urls.map((url) => (
        <ProductImage key={url} source={{ uri: url }} cachePolicy={getCachePolicy()} contentFit="cover" />
      ))}
    </ScrollView>
  );
};
