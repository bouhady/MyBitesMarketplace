# MyBites Marketplace Agent Instructions

Use this file as the rulebook for future AI-assisted changes. Follow the current implementation in this repository, not generic React Native defaults.

## Stack Constraints

- Runtime: Expo `~53.0.10`, React Native `0.79.6`, React `19.0.0`.
- Navigation: `@react-navigation/native` with `@react-navigation/native-stack`; route names live in `src/navigation/routes.ts`.
- UI styling: `styled-components/native` with theme providers in `src/app/providers/ThemeProvider.tsx`.
- Images: `expo-image` is used for remote product images. Do not replace it with React Native `Image` for product media.
- Lists: product catalog uses `@shopify/flash-list`. Do not fall back to `FlatList` for catalog-style or potentially growing lists.
- State: Redux Toolkit slices plus redux-saga side effects. Thunk is intentionally disabled in `src/app/store/store.ts`.
- Persistence: cart persistence goes through `CartPersistenceRepository` and stores only `itemsByProductId`.

## TypeScript Rules

- The project runs strict TypeScript:
  - `strict: true`
  - `noImplicitAny: true`
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
- Do not introduce new `any`. ESLint currently warns on explicit `any`; treat warnings as debt to avoid, not permission.
- Prefer exact domain types such as `ProductId`, `CategoryId`, `ProductSort`, `CartState`, `CatalogState`, and `CheckoutState`.
- Use typed Redux hooks from `src/app/store/store.ts`: `useAppDispatch` and `useAppSelector`.
- Saga functions must return `SagaIterator`, and yielded values should be typed on assignment.
- Keep route params typed through `RootStackParamList`.

## Architecture Rules

- Keep business rules in `src/domain`, not inside UI components.
- Keep API/mock networking in `src/data/api` and repository adapters in `src/data/repositories`.
- Keep feature state under `src/features/<feature>/state`.
- Keep screen orchestration in feature `screens` and feature-specific hooks.
- Keep pure reusable UI in `src/ui/components`; feature-specific UI belongs in `src/features/<feature>/components`.
- Do not dispatch full `Product` objects for cart increment/decrement. Use `{ productId }`; stock-aware increment clamping belongs in `cartSaga`.
- `addToCart` intentionally accepts a full `Product` because stock validation is performed at add time.
- Do not mix catalog list status with product-details status. Product details use `productDetailsStatusById` and `productDetailsErrorById`.
- Preserve catalog request signatures when changing pagination/search logic; stale list responses must be ignored.

## UI Rules

- Use `Screen` and `ScreenContent` wrappers from `src/ui/components/Screen.tsx` for screens.
- Use theme tokens through styled-components instead of hard-coded layout values where practical.
- Use `Button`, `Text`, `Chip`, `ErrorState`, `LoadingOverlay`, and `Divider` from `src/ui/components`.
- Quantity buttons must keep accessible labels: `Decrease quantity` and `Increase quantity`.
- Use stable `useCallback` handlers when callbacks are passed into memoized children.

## Redux And Saga Rules

- Root reducer keys are `catalog`, `cart`, and `checkout`.
- Root saga must fork watchers:
  - `fork(catalogSaga)`
  - `fork(cartSaga)`
  - `fork(checkoutSaga)`
- Store middleware disables thunk and keeps Redux Toolkit serializable checks enabled.
- `catalogSaga` owns:
  - 350ms search debouncing
  - category/sort-triggered reloads
  - product-details fetches
  - list request signatures
- `cartSaga` owns:
  - hydration from AsyncStorage
  - 250ms debounced persistence
  - stock-aware increment commands
  - non-fatal persistence save failures
- `checkoutSaga` owns:
  - empty-cart guard
  - order placement via `OrderRepository`
  - cart clearing after successful order placement

## Do Not

- Do not enable Redux thunk.
- Do not disable serializable checks globally.
- Do not persist `hydrationStatus` or `hydrationError`.
- Do not use ad hoc string paths for route names; import `routes`.
- Do not bypass repositories from feature code when fetching products or placing orders.
- Do not put API delay or filtering logic into screens.
- Do not replace `FlashList` in `ProductGrid` with `FlatList`.
- Do not remove product-detail error/not-found handling and return to indefinite loading.
- Do not mutate files outside the task scope or revert unrelated user changes.

## Common Commands

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
npm test -- --runInBand
npm run format:check
npm run expo:check
```

## Pre-Commit Verification

Run these before handing off code changes:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run expo:check
git status --short
```
