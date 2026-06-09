# Testing

The project uses Jest with `jest-expo` and React Native Testing Library.

Configuration files:

- `jest.config.js`
- `jest.setup.ts`
- `src/test/render/renderWithProviders.tsx`
- `src/test/factories/productFactory.ts`
- `src/test/factories/cartFactory.ts`

Run all tests:

```bash
npm test -- --runInBand
```

Run watch mode:

```bash
npm run test:watch
```

## Current Test Suites

```text
__tests__/
  cart/
    cartSelectors.test.ts
    cartSlice.test.ts
    cartSaga.test.ts
  catalog/
    catalogSaga.test.ts
    catalogSlice.test.ts
  checkout/
    checkoutSaga.test.ts
  ui/
    QuantitySelector.test.tsx
```

## Testing Redux Slices

Slice tests should call reducers directly and assert state transitions.

Existing examples:

- `__tests__/cart/cartSlice.test.ts`
  - add-to-cart clamps quantity at available stock
  - decrement removes item at zero
  - saga-approved increment clamps with `maxQuantity`
- `__tests__/catalog/catalogSlice.test.ts`
  - stale catalog responses are ignored
  - product detail failures do not change catalog list status
  - equivalent request payloads create stable signatures

When adding slice tests:

- Use actual action creators from the slice.
- Use domain factories from `src/test/factories`.
- Include all required `RootState` fields when selector tests need full state.
- Keep catalog list state separate from product-detail state.

## Testing Sagas

Saga tests use:

```ts
import { runSaga, stdChannel } from 'redux-saga';
```

The pattern is:

1. Create a `stdChannel`.
2. Pass `dispatch` and `getState` to `runSaga`.
3. Put actions into the channel.
4. Await a microtask or advance fake timers.
5. Assert dispatched actions or repository calls.
6. Cancel the task.

Existing saga coverage:

- `catalogSaga`
  - debounces search and commits only the latest query
  - product detail not-found dispatches `productDetailsFailed`
  - detail failures do not dispatch `catalogFailed`
- `cartSaga`
  - hydrates persisted cart state
  - handles hydration failure
  - debounces persistence after cart mutations
  - clamps increment requests using current catalog product data
  - keeps persistence watcher alive after save failures
- `checkoutSaga`
  - fails gracefully when placing an empty order

Use fake timers for debounced paths:

```ts
jest.useFakeTimers();
jest.advanceTimersByTime(260);
```

Current debounce timings:

- catalog search: `350ms`
- cart persistence: `250ms`

## Testing Components

Component tests use React Native Testing Library and `renderWithProviders`.

Existing example:

- `__tests__/ui/QuantitySelector.test.tsx` verifies the `+` button does not increment above stock boundary.

Component tests should focus on observable behavior:

- button disabled/pressed behavior
- loading and error states
- stock boundaries
- accessible labels for symbolic controls
- navigation callbacks through mocked props when necessary

Do not test implementation details such as styled-components generated class names.

## Mocking

`jest.setup.ts` mocks:

- `@react-native-async-storage/async-storage`
- `expo-image`

Repository methods can be spied on directly:

```ts
jest.spyOn(ProductRepository, 'listProducts').mockResolvedValue(...)
jest.spyOn(CartPersistenceRepository, 'saveCart').mockRejectedValueOnce(...)
```

Always restore mocks in `afterEach` for saga tests:

```ts
jest.restoreAllMocks();
jest.useRealTimers();
```

## Required Verification For Changes

For code changes, run:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
```

For dependency or Expo config changes, also run:

```bash
npm run expo:check
```
