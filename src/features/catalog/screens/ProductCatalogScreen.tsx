import React, { useCallback } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import type { Product } from '../../../domain/entities/Product';
import { Screen, ScreenContent } from '../../../ui/components/Screen';
import { TitleText } from '../../../ui/components/Text';
import { ErrorState } from '../../../ui/components/ErrorState';
import { routes } from '../../../navigation/routes';
import type { RootStackParamList } from '../../../navigation/RootNavigator.types';
import { useCatalog } from '../hooks/useCatalog';
import { useProductFilters } from '../hooks/useProductFilters';
import { SearchBar } from '../components/SearchBar';
import { CategoryChips } from '../components/CategoryChips';
import { SortMenu } from '../components/SortMenu';
import { ProductGrid } from '../components/ProductGrid';
import { CatalogSkeleton } from '../components/CatalogSkeleton';
import { Button } from '../../../ui/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, typeof routes.catalog>;

const Header = styled.View(({ theme }) => ({
  paddingVertical: theme.spacing.lg,
  gap: theme.spacing.md
}));

const HeaderRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const ProductCatalogScreen = ({ navigation }: Props) => {
  const catalog = useCatalog();
  const filters = useProductFilters();

  const openProduct = useCallback(
    (product: Product) => {
      navigation.navigate(routes.productDetails, { productId: product.id });
    },
    [navigation]
  );

  const openCart = useCallback(() => {
    navigation.navigate(routes.cart);
  }, [navigation]);

  const isInitialLoading = catalog.status === 'loading' && catalog.products.length === 0;
  const hasBlockingError = catalog.status === 'error' && catalog.products.length === 0;

  return (
    <Screen>
      <ScreenContent>
        <Header>
          <HeaderRow>
            <TitleText>Marketplace</TitleText>
            <Button label="Cart" variant="secondary" onPress={openCart} />
          </HeaderRow>
          <SearchBar value={catalog.query} onChangeText={catalog.setQuery} />
          <CategoryChips
            categories={filters.categories}
            selectedCategoryId={filters.selectedCategoryId}
            onSelectCategory={filters.selectCategory}
          />
          <SortMenu value={filters.sort} onChange={filters.selectSort} />
        </Header>
        {isInitialLoading ? <CatalogSkeleton /> : null}
        {hasBlockingError ? (
          <ErrorState title="Catalog unavailable" message={catalog.error ?? 'Unable to load products.'} onRetry={catalog.retry} />
        ) : (
          <ProductGrid
            products={catalog.products}
            status={catalog.status}
            onProductPress={openProduct}
            onRefresh={catalog.refresh}
            onLoadMore={catalog.loadMore}
          />
        )}
      </ScreenContent>
    </Screen>
  );
};
