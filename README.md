# MyBites Marketplace

MyBites Marketplace is an Expo React Native marketplace app for browsing food products, filtering and sorting a catalog, viewing product details, managing a persisted cart, and placing mock checkout orders.

## Features

- Product catalog with responsive `FlashList` grid.
- Search with 350ms debounced Redux Saga requests.
- Category filters and sort modes:
  - `rating_desc`
  - `price_asc`
  - `price_desc`
- Pull-to-refresh and infinite-scroll pagination.
- Product detail screen with loading, not-found/error, retry, and back-to-catalog states.
- Add-to-cart quantity selection with stock limits.
- Cart screen with item quantity controls, remove action, persisted cart storage, and pricing summary.
- Checkout flow with mock order placement, success screen, and error screen.
- Root error boundary around navigation.
- Strict TypeScript, ESLint, Prettier, Jest, and Expo dependency validation scripts.

## Tech Stack

- Expo `~53.0.10`
- React Native `0.79.6`
- React `19.0.0`
- React Navigation native stack
- Redux Toolkit
- redux-saga
- styled-components/native
- @shopify/flash-list
- expo-image
- AsyncStorage
- Jest and React Native Testing Library

## Prerequisites

- Node.js compatible with the project lockfile and GitHub CI. CI uses Node `22`.
- npm
- Expo CLI through `npx expo`
- iOS Simulator and/or Android emulator for native app runs

## Installation

```bash
npm install
```

## Running The App

Start Expo:

```bash
npm run start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

## Scripts

| Script                 | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `npm run start`        | Start Expo dev server.                       |
| `npm run android`      | Start Expo and open Android target.          |
| `npm run ios`          | Start Expo and open iOS target.              |
| `npm run web`          | Start Expo web target.                       |
| `npm test`             | Run Jest.                                    |
| `npm run test:watch`   | Run Jest in watch mode.                      |
| `npm run typecheck`    | Run `tsc --noEmit`.                          |
| `npm run lint`         | Run ESLint.                                  |
| `npm run format`       | Format files with Prettier.                  |
| `npm run format:check` | Check Prettier formatting.                   |
| `npm run expo:check`   | Validate installed Expo dependency versions. |

## Verification

Use this command set before submitting code changes:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run expo:check
```

Current test coverage includes catalog reducer/saga behavior, cart reducer/saga/selectors, checkout saga behavior, and product detail quantity selector stock bounds.

## App Identifiers

Production identifiers are configured in `app.json`:

- iOS bundle identifier: `com.mybites.marketplace`
- Android package: `com.mybites.marketplace`
- runtime version policy: `appVersion`

EAS profiles live in `eas.json`.
