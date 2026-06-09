# Redux Toolkit And Redux Saga Improvement Report

Generated: 2026-06-09

Scope: Review of Redux Toolkit, React Redux, selector, and redux-saga usage in this project. Recommendations are sorted by severity first, then by ease of implementation.

## Current Strengths

- Uses current major versions: `@reduxjs/toolkit` 2.x, `react-redux` 9.x, and `redux-saga` 1.3.x.
- Store setup uses `configureStore`, typed `RootState`, typed `AppDispatch`, and typed app hooks.
- Feature state is colocated cleanly under `src/features/*/state`.
- Sagas use `SagaIterator` and keep side effects out of reducers.
- Derived cart and catalog data is mostly handled through `createSelector`.
- Existing tests cover cart reducers/selectors and key catalog, cart, and checkout saga flows.

## Prioritized Improvements

| Priority | Severity | Ease | Area | Improvement |
|---:|---|---|---|---|
| 1 | High | Easy | Store safety | Re-enable RTK serializable middleware checks with narrow ignores instead of disabling them globally. |
| 2 | High | Easy | Root saga resilience | Use `fork` in `rootSaga` so one watcher failure does not terminate all watchers. |
| 3 | High | Medium | Catalog request correctness | Guard catalog pagination/search responses against stale or out-of-order results. |
| 4 | High | Medium | Product details state | Add a dedicated product details request status/error instead of writing detail failures into catalog list status. |
| 5 | Medium | Easy | Action design | Prefer ID-based cart quantity actions over dispatching full `Product` objects. |
| 6 | Medium | Easy | Cart persistence | Do not persist transient hydration status/error fields, and handle save failures explicitly. |
| 7 | Medium | Medium | Server state strategy | Consider RTK Query for catalog/product API state when the mock API becomes a real remote API. |
| 8 | Medium | Medium | Normalized entities | Consider `createEntityAdapter` for catalog products if collection operations grow. |
| 9 | Medium | Medium | Saga testing | Add tests for stale catalog responses, product-detail failure, and persistence save failure. |
| 10 | Low | Easy | Selectors | Replace trivial one-field `createSelector` selectors with simple accessors unless memoization is needed. |
| 11 | Low | Easy | Test utilities | Align `renderWithProviders` middleware with the production store when testing connected components. |

## Details

### 1. Re-enable RTK Serializable Checks

Severity: High  
Ease: Easy

Evidence: `src/app/store/store.ts:10-14` disables `serializableCheck` globally.

Why it matters: Redux Toolkit's serializable middleware is one of the useful development guardrails. Turning it off globally can hide non-serializable state or action payloads before they break persistence, replay/debugging, or future middleware.

Recommended implementation:

- Change `getDefaultMiddleware({ thunk: false, serializableCheck: false })` to keep `serializableCheck` enabled.
- If a specific path fails, ignore only that action/path with `ignoredActions`, `ignoredActionPaths`, or `ignoredPaths`.
- Keep full objects in normalized state and prefer ID payloads for routine commands.

### 2. Isolate Watchers In `rootSaga`

Severity: High  
Ease: Easy

Evidence: `src/app/store/rootSaga.ts:6-7` runs `yield all([catalogSaga(), cartSaga(), checkoutSaga()])`.

Why it matters: Calling watcher sagas directly inside `all` attaches them tightly. If one watcher throws unexpectedly outside its worker-level `try/catch`, the root task can unwind and stop the other watchers. The common saga pattern is `all([fork(watchA), fork(watchB)])`.

Recommended implementation:

- Import `fork` from `redux-saga/effects`.
- Use `yield all([fork(catalogSaga), fork(cartSaga), fork(checkoutSaga)])`.
- Optionally wrap the root saga in a restart/logging boundary later if production crash reporting is added.

### 3. Guard Catalog Against Stale Responses

Severity: High  
Ease: Medium

Evidence: `src/features/catalog/state/catalogSaga.ts:29-41` applies every successful response through `catalogPageLoaded`. `takeLatest` cancels previous saga tasks, but cancellation only helps if the underlying call cooperates. Future real network clients or repository layers may still resolve old requests.

Why it matters: Search, sort, category changes, refresh, and load-more all write into the same catalog list. A stale response can overwrite a newer query or append the wrong page.

Recommended implementation:

- Add a `requestId` or request signature to `catalogRequested` and `catalogPageLoaded`.
- Store the active request signature in `CatalogState`.
- In the reducer, ignore `catalogPageLoaded` if its request signature no longer matches the active query/category/sort/page.
- Add tests that dispatch fast query/filter changes and assert only the latest response mutates state.

### 4. Split Product Details Request State From Catalog List State

Severity: High  
Ease: Medium

Evidence: `src/features/catalog/state/catalogSaga.ts:56-72` handles product detail loading and dispatches `catalogFailed` on detail failure. `src/features/catalog/state/catalogSlice.ts:72-74` then marks the whole catalog list as `error`.

Why it matters: A failed detail lookup should not necessarily put the catalog list into an error state. It also makes it hard for the product detail screen to distinguish "not loaded yet", "not found", and "catalog list failed".

Recommended implementation:

- Add `productDetailsStatusById` and `productDetailsErrorById`, or create a small `productDetails` slice if the lifecycle grows.
- Add `productDetailsLoaded`, `productDetailsFailed`, and possibly `productDetailsNotFound` actions.
- Keep `catalogFailed` reserved for list/page request failures.

### 5. Prefer ID-Based Cart Quantity Actions

Severity: Medium  
Ease: Easy

Evidence: `src/features/cart/state/cartSlice.ts:52-71` requires full `Product` payloads for increment/decrement so it can clamp against product rules. `addToCart` also takes a full `Product` at `src/features/cart/state/cartSlice.ts:6-25`.

Why it matters: Full object action payloads increase Redux DevTools noise and make action contracts more coupled to the current domain object shape. They also make serializable checks more likely to be disabled again if the `Product` shape later grows non-serializable fields.

Recommended implementation:

- Keep `addToCart` with a `Product` only if the cart must validate stock/limits at the moment of add.
- Change increment/decrement payloads to `{ productId }`.
- Move stock/limit validation into a selector or saga if it needs current catalog product data.
- If product data is needed, have the saga select it by ID before dispatching a narrower reducer action.

### 6. Tighten Cart Persistence Semantics

Severity: Medium  
Ease: Easy

Evidence: `src/features/cart/state/cartSaga.ts:19-21` selects the whole cart state and saves it. The repository narrows the persisted value to `itemsByProductId` at `src/data/repositories/CartPersistenceRepository.ts:58-62`, but the saga still passes transient hydration fields. Save failures are not caught in `persistCart`.

Why it matters: Passing the full runtime state to persistence makes the boundary less explicit. Save failures can also bubble into the watcher task unexpectedly.

Recommended implementation:

- Introduce `selectPersistableCartState` or pass `itemsByProductId` directly.
- Wrap `persistCart` in `try/catch`; decide whether to dispatch a non-blocking persistence failure action or only log/report.
- Add a test for failed `saveCart` so the persistence watcher remains alive.

### 7. Consider RTK Query For Catalog/Product Server State

Severity: Medium  
Ease: Medium

Evidence: Catalog and product details are server/API-style data managed manually in `catalogSlice` and `catalogSaga`. The project currently uses a mock repository, so this is not urgent.

Why it matters: RTK Query is the default RTK best-practice tool for API state: caching, loading flags, deduplication, invalidation, retries, polling, and pagination support. Sagas are strongest for orchestration, cancellation, and multi-step workflows.

Recommended implementation:

- Keep sagas for checkout and persistence orchestration.
- When the API becomes remote, evaluate `createApi` for product lists and product details.
- Avoid duplicating RTK Query server data into slices; keep slices for UI state such as filters, selected category, and sort.

### 8. Consider `createEntityAdapter` For Catalog Products

Severity: Medium  
Ease: Medium

Evidence: `src/features/catalog/state/catalogSlice.ts:17-44` manually maintains `ids` and `entities`.

Why it matters: The current manual code is fine at this size, but `createEntityAdapter` reduces custom normalized-state logic as operations grow. It also provides standard selectors and update helpers.

Recommended implementation:

- Keep the current structure if catalog stays simple.
- Migrate to `createEntityAdapter<Product, ProductId>` if product upserts, removals, sorting, or bulk updates expand.
- Preserve explicit `ids` order semantics if list order is API-driven; adapter helpers can still be used carefully for entity management.

### 9. Expand Saga Edge-Case Tests

Severity: Medium  
Ease: Medium

Evidence: Existing saga tests cover debounce and basic success/failure flows, but the higher-risk async edges are not covered.

Recommended implementation:

- Test stale catalog response protection after adding request signatures.
- Test product detail not-found/failure without changing list status.
- Test cart persistence save failure and confirm the watcher can process later cart mutations.
- Test checkout double-submit behavior with `takeLatest`, or switch to `takeLeading` if duplicate order submission should be ignored while one request is in progress.

### 10. Simplify Trivial Selectors

Severity: Low  
Ease: Easy

Evidence: Selectors like `selectCatalogStatus`, `selectCatalogError`, and similar one-field accessors in `src/features/catalog/state/catalogSelectors.ts:5-12` and `src/features/checkout/state/checkoutSelectors.ts` use `createSelector` without deriving new data.

Why it matters: This is not a correctness problem. It just adds extra abstraction where a plain accessor is enough. Reserve `createSelector` for derived arrays/objects or expensive calculations, such as `selectCatalogProducts` and cart pricing.

Recommended implementation:

- Convert trivial selectors to plain functions.
- Keep memoized selectors for `selectCatalogProducts`, `selectCartItems`, `selectCartItemsWithProducts`, and `selectCartPricing`.

### 11. Align Test Store Middleware With Production

Severity: Low  
Ease: Easy

Evidence: `src/test/render/renderWithProviders.tsx:13-17` creates a store with only `rootReducer`. Production disables thunk and adds saga middleware in `src/app/store/store.ts:8-14`.

Why it matters: Component tests can pass with a middleware setup that differs from production. This is low risk now because most component hooks dispatch plain actions, but the gap grows if components rely on saga-driven behavior in integration tests.

Recommended implementation:

- Export a `makeStore` factory from the app store module.
- Let tests choose whether to include saga middleware.
- For integration-style tests, run the same middleware stack as production and avoid importing the singleton `store`.

## Suggested Execution Order

1. Re-enable serializable checks and isolate root sagas with `fork`.
2. Add product detail lifecycle state and stale-response protection.
3. Tighten cart persistence boundaries and add edge-case saga tests.
4. Revisit RTK Query and `createEntityAdapter` when replacing the mock API or expanding catalog behavior.
5. Simplify trivial selectors and align test store setup as cleanup tasks.
