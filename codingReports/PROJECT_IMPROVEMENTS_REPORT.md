# MyBites Marketplace React Native Improvement Report

Generated: 2026-06-09

Scope: React Native / Expo project review for best practices, sorted by severity first and ease of implementation second.

## Current Strengths

- Modern baseline: Expo 53, React Native 0.79.6, React 19, Hermes/New Architecture-compatible stack.
- TypeScript strictness is strong: `strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` are enabled.
- App structure is clean and feature-oriented under `src/features`, with domain/data/ui separation.
- Uses React Navigation native stack, FlashList for the product grid, expo-image for remote images, Redux Toolkit, typed hooks, sagas, selectors, and focused Jest tests.
- Current verification passes:
  - `npm run typecheck`
  - `npm test -- --runInBand`

## Prioritized Improvements

| Priority | Severity | Ease | Area | Improvement |
|---:|---|---|---|---|
| 1 | High | Easy | Release config | Add production app identifiers, version codes, runtime version, update policy, and EAS build profiles. |
| 2 | High | Easy | Store safety | Re-enable Redux Toolkit serializable checks with narrow ignores instead of disabling them globally. |
| 3 | High | Medium | Error handling | Add a root error boundary and user-facing fallback for render/runtime crashes. |
| 4 | High | Medium | CI quality gate | Add CI that runs typecheck, tests, lint, and dependency validation on every PR. |
| 5 | Medium | Easy | Tooling | Add ESLint and Prettier configs/scripts. |
| 6 | Medium | Easy | Accessibility | Replace symbolic `+`/`-` quantity button labels with accessible labels and/or icon buttons. |
| 7 | Medium | Easy | Product details UX | Show a real not-found/error state for missing product details instead of an indefinite loading overlay. |
| 8 | Medium | Easy | Navigation/performance | Avoid inline navigation callbacks in JSX where callbacks are passed to memoized children. |
| 9 | Medium | Medium | Cart performance | Use FlashList or SectionList for cart entries if cart size can grow meaningfully. |
| 10 | Medium | Medium | Server state | Consider TanStack Query if the mock API becomes a real remote API. |
| 11 | Low | Easy | App config | Add icon/splash assets and platform-specific metadata. |
| 12 | Low | Medium | Test coverage | Add integration tests for main user flows and persistence edge cases. |

## Details

### 1. Add Production App Identifiers And EAS Profiles

Severity: High  
Ease: Easy

Evidence: `app.json` only defines name, slug, version, orientation, light style, basic tablet support, and adaptive icon background. It does not define iOS `bundleIdentifier`, Android `package`, Android `versionCode`, iOS `buildNumber`, `runtimeVersion`, `updates`, or EAS profiles.

Why it matters: Without stable app IDs and build metadata, store submissions, OTA update targeting, build reproducibility, and environment separation become fragile.

Recommended fix:

- Add `ios.bundleIdentifier`, `ios.buildNumber`, `android.package`, and `android.versionCode`.
- Add `runtimeVersion` and an explicit `updates` policy if OTA updates are intended.
- Add `eas.json` with development, preview, and production profiles.
- Move environment-dependent values to `app.config.ts` if staging/production variants are needed.

### 2. Re-enable Serializable Checks With Narrow Ignores

Severity: High  
Ease: Easy

Evidence: `src/app/store/store.ts` disables `serializableCheck` globally.

Why it matters: The app currently dispatches full `Product` objects and persists cart state. Global opt-out removes Redux Toolkit's guardrails for non-serializable actions/state, which can hide bugs in persistence, replay, debugging, and future middleware.

Recommended fix:

- Re-enable `serializableCheck`.
- Ignore only specific known-safe action paths if needed.
- Prefer passing IDs in navigation/actions where possible, and keep rich objects in normalized state.

### 3. Add A Root Error Boundary

Severity: High  
Ease: Medium

Evidence: `src/app/App.tsx` mounts providers and navigation directly. There is no root error boundary or fallback screen.

Why it matters: A render crash in any screen can blank the app. A marketplace app should recover with a clear fallback and optional retry/reporting path.

Recommended fix:

- Add a root `ErrorBoundary` component around `RootNavigator`.
- Log errors to a production reporter later, such as Sentry.
- Provide a fallback screen with retry/reset behavior.

### 4. Add CI Quality Gates

Severity: High  
Ease: Medium

Evidence: `package.json` has `test` and `typecheck`, but no CI workflow was found.

Why it matters: The project already has useful tests and strict TS. Running them only locally leaves regressions dependent on developer discipline.

Recommended fix:

- Add `.github/workflows/ci.yml`.
- Run `npm ci`, `npm run typecheck`, `npm test -- --runInBand`, and lint after adding linting.
- Consider `npx expo-doctor` for Expo compatibility checks.

### 5. Add ESLint And Prettier

Severity: Medium  
Ease: Easy

Evidence: No project ESLint or Prettier config/script was found. `package.json` currently exposes only start/platform/test/typecheck scripts.

Why it matters: TypeScript catches type issues, but linting catches unsafe hooks dependencies, accidental inline styles, floating promises, import hygiene, unused exports, and React Native-specific mistakes.

Recommended fix:

- Add Expo/React Native-compatible ESLint configuration.
- Add `lint` and `format` scripts.
- Include `eslint-plugin-react-hooks`, React Native rules, and TypeScript rules.

### 6. Improve Quantity Selector Accessibility

Severity: Medium  
Ease: Easy

Evidence: `QuantitySelector` renders buttons with labels `-` and `+`.

Why it matters: Screen readers may announce symbolic labels poorly. The buttons need clear actions like "Decrease quantity" and "Increase quantity".

Recommended fix:

- Add `accessibilityLabel` to each button.
- Consider icon buttons with accessible names.
- Add `accessibilityRole="adjustable"` or expose increment/decrement semantics if refactoring the control.

### 7. Replace Indefinite Product Loading With Not-found/Error State

Severity: Medium  
Ease: Easy

Evidence: `ProductDetailsScreen` shows `LoadingOverlay` whenever `product` is missing.

Why it matters: If an invalid product ID is opened, or product loading fails, the user sees permanent loading rather than a recoverable error.

Recommended fix:

- Track product detail request status and error separately from catalog list status.
- Show an error/not-found state with retry and back-to-catalog action.

### 8. Avoid Inline Navigation Callbacks In JSX

Severity: Medium  
Ease: Easy

Evidence: `ProductDetailsScreen` passes an inline callback to the "View cart" button.

Why it matters: This is minor now, but the project already uses memoized components and callbacks. Keeping callback references stable prevents avoidable renders as shared UI grows.

Recommended fix:

- Extract `openCart` with `useCallback`.
- Apply the same pattern for callbacks passed into memoized UI components.

### 9. Consider Virtualizing Cart Entries

Severity: Medium  
Ease: Medium

Evidence: `CartScreen` maps cart rows inside a `ScrollView`.

Why it matters: A small cart is fine. If marketplace usage allows many cart lines, rendering all rows at once can hurt memory and responsiveness.

Recommended fix:

- Keep `ScrollView` if cart size is capped and small.
- Otherwise migrate cart rows to `FlashList` with an estimated row size and a list footer for `CartSummary`/checkout.

### 10. Consider TanStack Query For Real Remote API State

Severity: Medium  
Ease: Medium

Evidence: Catalog and order requests are modeled through Redux sagas around a mock API.

Why it matters: Sagas are acceptable for workflow orchestration, but server cache concerns such as stale time, request dedupe, retries, pagination, background refresh, and cache invalidation are better handled by TanStack Query.

Recommended fix:

- Keep Redux for cart/checkout UI state if desired.
- Move catalog/product server state to TanStack Query when replacing the mock API with real networking.
- Keep sagas only for workflows that benefit from orchestration.

### 11. Add Complete App Assets And Metadata

Severity: Low  
Ease: Easy

Evidence: `app.json` defines adaptive icon background color but no icon foreground, splash, scheme, or store-facing metadata.

Why it matters: This is not a code correctness issue, but it matters before distribution and deep linking.

Recommended fix:

- Add `icon`, `splash`, Android adaptive foreground image, and URL `scheme` if deep links are needed.
- Add platform-specific permissions only when required.

### 12. Broaden Test Coverage Around User Flows

Severity: Low  
Ease: Medium

Evidence: Existing tests cover cart reducer/selectors/saga, checkout saga, catalog saga, and quantity selector.

Why it matters: Current coverage is a good base, but main marketplace flows are not fully covered at screen/integration level.

Recommended fix:

- Add React Native Testing Library integration tests for browse, search/filter/sort, add to cart, update cart, checkout success, and checkout failure.
- Add persistence tests for corrupted AsyncStorage payloads and cart hydration failure.
- Add one E2E smoke flow with Maestro or Detox when device automation is introduced.

## Suggested Execution Order

1. Add ESLint/Prettier and CI first, because they protect every later change.
2. Fix Redux serializable checks and product-details not-found behavior.
3. Add release/EAS metadata before any store or OTA workflow.
4. Add the error boundary and broaden test coverage.
5. Revisit cart virtualization and TanStack Query when product/API scale becomes real.
