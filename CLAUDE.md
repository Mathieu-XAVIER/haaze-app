# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Haaze is a React Native/Expo mobile app for managing NFC-connected clothing. Features gamification with missions, XP, levels, and customizable skins.

## Commands

```bash
npm start                    # Start Expo dev server
npm run android              # Run on Android
npm run ios                  # Run on iOS
npm run web                  # Run on web
npm run dev-client           # Dev client mode

# Production builds via EAS
npm run build:ios:dev        # iOS development build
npm run build:ios:preview    # iOS preview build
npm run build:android:production  # Android production
npm run build:ios:production      # iOS production
```

## Environment Setup

1. Copy `env.example` to `.env`
2. Set `EXPO_PUBLIC_API_URL` to your Laravel API URL
3. Restart Metro: `npm start -- --clear`

## Tech Stack

- React Native 0.81 + Expo SDK 54 + TypeScript (strict)
- React Navigation v7 (native-stack + bottom-tabs)
- Axios for HTTP with JWT auth via AsyncStorage
- `react-native-nfc-manager` for NFC tag reading
- Custom fonts: SpecialGothicExpandedOne (titles), Manrope (body)

## Architecture

**Entry:** `index.ts` → `App.tsx` (auth state + root navigation)

**Key directories:**
- `screens/` - Full-page views (11 screens)
- `components/` - Reusable UI (ClothingCard, MissionCard, Navbar, SectionTitle)
- `services/api.ts` - Axios instance, all API functions, TypeScript interfaces
- `styles/theme.ts` - COLORS and FONTS constants
- `hooks/useAppFonts.ts` - Font loading hook
- `navigation/BottomTabs.tsx` - Tab navigator config
- `plugins/` - Expo config plugins for NFC permissions

**Navigation flow:**
```
RootNavigator (Stack)
├── LoginScreen (when unauthenticated)
└── MainNavigator
    ├── BottomTabNavigator (Home, Missions, Collection, Profile)
    └── Modal screens (Scan, AddClothing, Orders, OrderDetail, NFCLink)
```

## Code Patterns

**Styling:** Always use constants from `styles/theme.ts`:
```typescript
import { COLORS, FONTS } from '../styles/theme';
// COLORS.primaryBlue (#3300FD), COLORS.accentYellow (#F0F600)
// FONTS.title, FONTS.body, FONTS.bodyBold
```

**API responses:** The Laravel API returns mixed snake_case/camelCase. Functions in `api.ts` handle this with fallbacks. Use `normalizeImageUrl()` for images.

**Cross-platform shadows:** Web uses `boxShadow`, Native uses `shadowColor`/`shadowOffset`/etc.

**State:** Local hooks only (`useState`, `useEffect`). Auth state lives in `App.tsx` with AsyncStorage persistence.

## Authentication

- Token stored in AsyncStorage under key `token`
- Login state under key `haaze_logged_in`
- Axios interceptor auto-adds `Authorization: Bearer {token}`

## NFC Integration

- Custom plugin at `plugins/withNfc.js` configures Android/iOS permissions
- Uses `react-native-nfc-manager` with conditional import for Expo Go support
- Error codes: `NFC_ALREADY_LINKED`, `ALL_ITEMS_LINKED`, `CLOTHING_NOT_IN_ORDER`, `ORDER_NOT_OWNED`

## Backend

Laravel API at https://github.com/Mathieu-XAVIER/lara-haaze
Production: `https://haaze.mathieu-xavier.fr/api`

Key endpoints documented in `AGENTS.md`.

## Additional Documentation

See `AGENTS.md` for detailed API endpoints, data models, and French documentation.
