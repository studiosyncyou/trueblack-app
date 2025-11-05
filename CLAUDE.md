# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrueBlackApp is a React Native coffee delivery application built with Redux Toolkit and React Navigation v7. The app features menu browsing, cart management, order tracking, and location-based services.

## Development Commands

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (requires CocoaPods setup first)
bundle install                    # First time only
bundle exec pod install           # Run after updating native dependencies
npm run ios
```

### Development Tools

```bash
# Run linter
npm run lint

# Run tests
npm test
```

### iOS-Specific Setup

When working with iOS, CocoaPods dependencies must be installed:
```bash
cd ios
bundle exec pod install
cd ..
```

## Architecture Overview

### Navigation Structure

The app uses a **conditional rendering pattern** with Stack + Tab navigation:

```
AppNavigator
├── SplashScreen (1.2s auto-transition)
├── LoginScreen (shown if !authenticated)
└── MainTabs (shown if authenticated)
    ├── HomeScreen
    ├── MenuStack (nested stack)
    │   ├── MenuScreen
    │   ├── ItemDetailScreen (modal)
    │   └── CartScreen
    ├── OrdersScreen
    └── ProfileScreen
```

Navigation file: `src/navigation/AppNavigator.jsx`

The cart badge in tabs shows `totalQuantity` from Redux store, capped at 99.

### State Management: Redux Toolkit

**IMPORTANT:** The codebase has two Redux directories:
- `src/store/` - **ACTIVE** (used in App.jsx)
- `src/redux/` - DEPRECATED (legacy code, not imported)

Always use `src/store/` when working with Redux.

**Store Configuration:**
- Location: `src/store/store.js`
- Serialization checks are **disabled** (required for navigation state)
- Configured with `configureStore` from Redux Toolkit

**Slices:**

1. **Auth Slice** (`src/store/slices/authSlice.js`)
   - State: `{ isAuthenticated, user, token }`
   - Actions: `login`, `logout`, `updateUser`
   - Used by: AppNavigator for conditional rendering

2. **Cart Slice** (`src/store/slices/cartSlice.js`)
   - State: `{ items[], totalQuantity, totalAmount }`
   - Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
   - Features: Item deduplication with `cartItemId` for different customizations

### Screen Organization

Screens are organized by feature in `src/screens/`:

```
screens/
├── auth/       - LoginScreen (mock authentication)
├── splash/     - SplashScreen (brand animation)
├── home/       - HomeScreen (dashboard, quick actions, popular items)
├── menu/       - MenuScreen, ItemDetailScreen (browsing + cart)
├── cart/       - CartScreen (review, update quantities)
├── orders/     - OrdersScreen (ongoing/history with status)
├── profile/    - ProfileScreen (user info, settings)
└── orders/     - CheckoutScreen (⚠️ created but not implemented)
```

### Theme & Design System

All design tokens are centralized in `src/config/theme.js`:
- Colors (including veg/non-veg/egg indicators)
- Spacing scale (xs → xxxl)
- Typography system (h1-h4, body, caption, button)
- Border radius presets
- Shadow system with elevation

When adding new UI components, import and use theme values for consistency.

### Data Layer

Currently uses **mock data** (no backend integration):
- `src/data/menuData.js` - 40+ menu items with categories, types, customizations
- `src/data/storeData.js` - Store locations with coordinates

**Menu Item Structure:**
```javascript
{
  id, name, category, type, price, description,
  popular, available, prepTime, calories,
  customizations?: { extras, size, temperature, etc. }
}
```

**Cart Item Structure:**
```javascript
{
  id, name, price, quantity,
  customizations?, totalPrice,
  cartItemId  // Unique ID per variant with different customizations
}
```

### Location Services

The app uses `@react-native-community/geolocation` for location features:
- Permission requests (Android/iOS)
- Distance calculations (Haversine formula)
- Store location proximity
- Implementation: MenuScreen.jsx

## Key Dependencies

- **React Native:** 0.82.1 (React 19.1.1)
- **State:** Redux Toolkit 2.9.2
- **Navigation:** React Navigation v7 (stack + bottom-tabs)
- **UI:** React Native Paper 5.14.5 (Material Design)
- **Icons:** react-native-vector-icons (Ionicons)
- **Geolocation:** @react-native-community/geolocation

## Development Notes

### When Adding New Screens

1. Create screen component in appropriate `src/screens/[feature]/` directory
2. Add route to `AppNavigator.jsx` (either MainTabs or MenuStack)
3. If authenticated-only, ensure it's inside MainTabs
4. For modal presentation, use: `options={{ presentation: 'modal' }}`

### When Working with Cart

- Cart items use `cartItemId` to distinguish items with different customizations
- Always update `totalQuantity` and `totalAmount` when modifying cart
- Tax is calculated at 5% in CartScreen
- Delivery fee is fixed at ₹40

### When Adding Features Requiring Location

- Check for location permissions first (see MenuScreen.jsx:140-200)
- Handle both Android and iOS permission flows
- User coordinates are stored in component state (not Redux)

### Redux Best Practices in This Project

- Use Redux Toolkit's `createSlice` for new state
- Place slices in `src/store/slices/`
- Register reducers in `src/store/store.js`
- Use `useSelector` and `useDispatch` hooks in components
- Avoid putting non-serializable values in Redux (except navigation state)

### Known Issues/TODOs

1. **Dual Redux Directories:** `src/redux/` should be removed (currently unused)
2. **CheckoutScreen:** Created but not implemented (src/screens/orders/CheckoutScreen.jsx)
3. **Backend Integration:** No API service layer yet (all mock data)
4. **Data Persistence:** Cart/orders don't persist across app restarts
5. **Real Authentication:** Login is currently mock (dispatches hardcoded user)

## Important File Locations

| Purpose | Location |
|---------|----------|
| App entry point | `App.jsx` |
| Navigation setup | `src/navigation/AppNavigator.jsx` |
| Redux store | `src/store/store.js` |
| Auth slice | `src/store/slices/authSlice.js` |
| Cart slice | `src/store/slices/cartSlice.js` |
| Theme config | `src/config/theme.js` |
| Menu data | `src/data/menuData.js` |
| Store locations | `src/data/storeData.js` |

## Git Status (Session Start)

Current branch: `main`
- Modified: `src/navigation/AppNavigator.jsx`
- Untracked: `assets/`, `src/screens/orders/CheckoutScreen.jsx`, `src/screens/splash/`
