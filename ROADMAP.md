# Roadmap And Handoff

This file records the current implementation status and the next useful work for future agents.

## Current Feature Status

| Area                              | Status            | Notes                                                                                                       |
| --------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| App shell                         | Complete          | `AppProviders`, root `ErrorBoundary`, status bar, and `RootNavigator` are wired.                            |
| Navigation                        | Complete          | Native stack routes are typed through `RootStackParamList`.                                                 |
| Catalog grid                      | Complete          | Uses `FlashList`, responsive 2/3 columns, estimated item size, pull-to-refresh, infinite scroll.            |
| Catalog search                    | Complete          | Search input dispatches immediately; saga commits debounced query after 350ms.                              |
| Catalog filters                   | Complete          | Category chips and sort menu update Redux state and trigger reloads.                                        |
| Catalog pagination                | Complete          | `loadMore` is guarded by `hasMore` and loading statuses.                                                    |
| Stale catalog response protection | Complete          | Request signatures prevent stale success/failure payloads from mutating list state.                         |
| Product details                   | Complete          | Loads by `ProductId`, reuses existing catalog entity when present, handles not-found/error states.          |
| Add to cart                       | Complete          | Detail screen dispatches `addToCart` with full `Product`, selected quantity, and timestamp.                 |
| Cart                              | Complete          | Displays empty state or cart rows, quantity controls, remove button, summary, and checkout CTA.             |
| Cart persistence                  | Complete          | Hydrates on startup and persists only `itemsByProductId` with debounced saves.                              |
| Checkout                          | Complete          | Places mock order, handles empty cart, clears cart on success, routes to success/error screens.             |
| Release config                    | Complete baseline | `app.json` has iOS/Android identifiers and runtime version. `eas.json` has dev/preview/production profiles. |
| CI                                | Complete baseline | GitHub Actions runs install, lint, typecheck, tests, and Expo dependency validation.                        |
| Test coverage                     | Solid baseline    | Unit/saga/component tests cover key reducer, saga, selector, and stock-bound behavior.                      |

## Edge Cases Already Handled

- Catalog empty state is shown only when status is `success`.
- Blocking catalog errors show `ErrorState` only when no products are already loaded.
- Search is debounced to avoid firing a request for every keystroke.
- Load-more is ignored when there are no more products.
- Load-more is ignored while initial load, refresh, or another load-more is active.
- Catalog stale responses are ignored with `activeRequestSignature`.
- Product detail not-found no longer produces indefinite loading.
- Product detail failure does not mark the whole catalog list as failed.
- Add-to-cart clamps requested quantity to stock availability.
- Product detail add-to-cart button is disabled when stock is zero.
- Cart increment uses current catalog product stock before mutating state.
- Cart decrement removes the item when quantity reaches zero.
- Persisted cart parsing ignores malformed item records.
- Cart persistence saves only `itemsByProductId`, not hydration runtime fields.
- Cart persistence save failure is caught so the watcher continues handling later mutations.
- Empty checkout dispatches a user-facing checkout failure instead of calling the order API.
- Successful checkout clears cart state.
- Root render/runtime crashes show a retryable fallback instead of blanking the app.
- Quantity `+`/`-` controls have accessible labels.

## Known Debt

- `src/navigation/RootNavigator.routes.ts` currently uses `React.ComponentType<any>` and triggers an ESLint warning. Future cleanup should type route config entries without `any`.
- Cart rows are rendered in a `ScrollView`. This is acceptable for a small cart, but should move to `FlashList` if carts can grow large.
- Catalog entities are manually normalized with `ids` and `entities`. `createEntityAdapter` can be considered if product collection operations expand.
- Server state is currently modeled with Redux Saga over a mock API. If a real remote API is introduced, evaluate RTK Query or TanStack Query for caching, request dedupe, retries, and invalidation.
- There is no full screen integration test for browse -> product details -> add to cart -> checkout success.
- No E2E smoke test exists yet.
- App assets are incomplete: adaptive foreground icon, splash image, and store-facing metadata are not fully configured.

## Suggested Next Steps

1. Remove the `React.ComponentType<any>` warning in `RootNavigator.routes.ts` with a typed route config helper.
2. Add a React Native Testing Library integration test for the primary purchase flow.
3. Add corrupted AsyncStorage payload tests for `CartPersistenceRepository`.
4. Add checkout duplicate-submit behavior coverage and decide whether `takeLatest` or `takeLeading` is desired.
5. Add icon/splash assets and any required platform metadata before store submission.
6. Consider virtualizing cart rows with `FlashList` if product/cart volume grows.
7. Revisit API state strategy when replacing `marketplaceApi` mock data with a real backend.

## Handoff Checklist

Before handing off future code changes, run:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run expo:check
git status --short
```
