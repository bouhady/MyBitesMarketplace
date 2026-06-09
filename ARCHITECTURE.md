# Architecture

MyBites Marketplace is an Expo React Native application structured by feature, with explicit domain and data layers. The app uses React Navigation native stack, Redux Toolkit slices, redux-saga workflows, styled-components theming, FlashList for the catalog grid, and Expo Image for product media.

## Source Tree

```text
src/
  app/
    App.tsx
    components/
      ErrorBoundary.tsx
    providers/
      AppProviders.tsx
      NavigationProvider.tsx
      StoreProvider.tsx
      ThemeProvider.tsx
    store/
      rootReducer.ts
      rootSaga.ts
      sagaMiddleware.ts
      store.ts
  data/
    api/
      marketplaceApi.ts
      marketplaceApi.types.ts
    mock/
      categoryDataset.ts
      delay.ts
      productDataset.ts
    repositories/
      CartPersistenceRepository.ts
      CartRepository.ts
      OrderRepository.ts
      ProductRepository.ts
  domain/
    entities/
      CartItem.ts
      Category.ts
      Order.ts
      Product.ts
    errors/
      DomainError.ts
    services/
      cartRules.ts
      pricingRules.ts
    valueObjects/
      Money.ts
      Pagination.ts
      Sort.ts
  features/
    cart/
      components/
      hooks/
      screens/
      state/
    catalog/
      components/
      hooks/
      screens/
      state/
    checkout/
      components/
      hooks/
      screens/
      state/
    productDetails/
      components/
      hooks/
      screens/
  navigation/
    RootNavigator.routes.ts
    RootNavigator.tsx
    RootNavigator.types.ts
    routes.ts
  shared/
    types/
    utils/
  test/
    factories/
    render/
  ui/
    components/
    theme/
```

## Layer Responsibilities

### App Layer

`src/app/App.tsx` composes the global runtime shell:

- `AppProviders`
- `StatusBar`
- root `ErrorBoundary`
- `RootNavigator`

Providers are split by responsibility:

- `GestureHandlerRootView` in `AppProviders`
- styled-components theme in `ThemeProvider`
- Redux Provider in `StoreProvider`
- React Navigation `NavigationContainer` in `NavigationProvider`

The Redux store is centralized in `src/app/store/store.ts`. It combines reducers from `rootReducer`, runs `rootSaga`, disables thunk, keeps serializable middleware checks enabled, and dispatches `cartHydrationRequested` on startup.

### Navigation Layer

Route constants live in `src/navigation/routes.ts`. Navigation params are typed in `RootNavigator.types.ts`.

Current stack routes:

- `Catalog`
- `ProductDetails` with `{ productId: ProductId }`
- `Cart`
- `Checkout`
- `OrderSuccess`
- `OrderError`

`RootNavigator.routes.ts` maps route names to screen components and titles. `RootNavigator.tsx` renders those routes with a native stack.

### Domain Layer

The domain layer is framework-independent. It defines core types and rules:

- `Product`, `ProductId`, `CategoryId`, stock, rating, images, metadata.
- `CartItem` with `productId`, `quantity`, and `addedAt`.
- `Order`, `OrderId`, `OrderStatus`.
- `clampCartQuantity`, `canAddToCart`, and `toCartItem` in `cartRules.ts`.
- `calculateCartPricing` in `pricingRules.ts`.

Pricing rules currently apply:

- tax rate: `0.0825`
- bulk discount threshold: `150`
- bulk discount rate: `0.05`

### Data Layer

The data layer adapts mock APIs to repositories:

- `marketplaceApi.ts` provides mock `listProducts`, `getProductById`, and `placeOrder`.
- `ProductRepository` exposes product list/detail operations.
- `OrderRepository` exposes order placement.
- `CartPersistenceRepository` owns AsyncStorage cart parsing and persistence.
- `CartRepository.now()` provides timestamps for cart additions.

The mock API applies delay through `src/data/mock/delay.ts`, filters product data by query/category, sorts by `price_asc`, `price_desc`, or `rating_desc`, and paginates with `page` and `limit`.

### Feature Layer

Each feature owns its screen, hook, component, and state boundary where applicable.

`catalog`:

- `ProductCatalogScreen` composes search, category chips, sort menu, skeleton/error states, and `ProductGrid`.
- `useCatalog` dispatches initial/refresh/load-more/search actions.
- `useProductFilters` dispatches category and sort changes.
- `ProductGrid` uses `FlashList`, responsive columns, pull-to-refresh, and infinite-scroll footer state.

`productDetails`:

- `ProductDetailsScreen` reads `productId` route params, uses `useProductDetails`, handles loading/not-found/error states, and dispatches `addToCart`.
- `AddToCartPanel` and `QuantitySelector` enforce visible stock bounds.

`cart`:

- `CartScreen` displays empty state or cart rows plus summary and checkout button.
- `useCart` exposes cart entries, pricing, empty status, and ID-based increment/decrement/remove commands.
- `CartItemRow` is pure UI and receives callbacks from the hook/screen layer.

`checkout`:

- `CheckoutScreen` displays pricing summary and places orders.
- Success/error navigation is driven by checkout state.
- `OrderSuccessScreen` and `OrderErrorScreen` reset checkout before returning.

### UI Layer

Shared UI primitives live in `src/ui/components`:

- `Button`
- `Text`
- `Screen`
- `LoadingOverlay`
- `Chip`
- `ErrorState`
- `Divider`

Theme tokens live in `src/ui/theme/tokens.ts` and are exposed via styled-components.

## Smart Containers vs Pure UI

Keep stateful orchestration in hooks/screens:

- `useCatalog`, `useProductFilters`, `useProductDetails`, `useCart`, `useCheckout`
- screen-level navigation callbacks
- Redux dispatch/select calls

Keep components pure and memoized where practical:

- `ProductGrid`
- `ProductCard`
- `QuantitySelector`
- `AddToCartPanel`
- `CartItemRow`
- `QuantityStepper`
- checkout summary/button components

Pure components should receive typed props and callbacks. They should not import repositories, dispatch Redux actions directly, or know about navigation route names.
