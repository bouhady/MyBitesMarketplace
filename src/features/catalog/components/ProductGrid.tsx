import React, { memo, useCallback } from 'react';
import { ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import styled from 'styled-components/native';
import type { Product } from '../../../domain/entities/Product';
import { ProductCard } from './ProductCard';
import { CatalogEmptyState } from './CatalogEmptyState';

interface ProductGridProps {
  products: Product[];
  status: string;
  onProductPress: (product: Product) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const Footer = styled.View(({ theme }) => ({
  padding: theme.spacing.lg,
  alignItems: 'center'
}));

export const ProductGrid = memo(({ products, status, onProductPress, onRefresh, onLoadMore }: ProductGridProps) => {
  const { width } = useWindowDimensions();
  const columns = width >= 720 ? 3 : 2;

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} onPress={onProductPress} />,
    [onProductPress]
  );

  return (
    <FlashList
      testID="product-grid"
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={columns}
      estimatedItemSize={254}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.45}
      ListEmptyComponent={status === 'success' ? <CatalogEmptyState /> : null}
      ListFooterComponent={status === 'loadingMore' ? <Footer><ActivityIndicator /></Footer> : null}
      refreshControl={<RefreshControl refreshing={status === 'refreshing'} onRefresh={onRefresh} />}
    />
  );
});
