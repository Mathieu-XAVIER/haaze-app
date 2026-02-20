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

**Entry:** `index.ts` → `App.tsx` (auth state, root navigation, `RootStackParamList` type definitions)

**Key directories:**
- `screens/` - Full-page views (HomeScreen, MissionsScreen, CollectionScreen, ProfileScreen, LoginScreen, ScanScreen, AddClothingScreen, OrdersScreen, OrderDetailScreen, NFCLinkScreen, LinkClothingScreen)
- `components/` - Reusable UI (ClothingCard, MissionCard, Navbar, SectionTitle)
- `services/api.ts` - Axios instance, all API functions, TypeScript interfaces
- `styles/theme.ts` - COLORS and FONTS constants
- `hooks/useAppFonts.ts` - Font loading hook
- `navigation/BottomTabs.tsx` - Tab navigator config
- `plugins/` - Expo config plugins (`withNfc.js` for NFC permissions, `withAndroidProviders.js`)

**Navigation flow:**
```
RootNavigator (Stack)
├── LoginScreen (when unauthenticated)
└── MainNavigator
    ├── BottomTabNavigator (Home, Missions, Collection, Profile)
    └── Modal screens (Scan, AddClothing, Orders, OrderDetail, NFCLink)
```

**Navigation types:** `RootStackParamList` in `App.tsx` defines typed params for all stack screens.

## Code Patterns

**Styling:** Always use constants from `styles/theme.ts`:
```typescript
import { COLORS, FONTS } from '../styles/theme';
// COLORS.primaryBlue (#3300FD), COLORS.accentYellow (#F0F600)
// FONTS.title, FONTS.body, FONTS.bodyBold
```

**API responses:** The Laravel API returns mixed snake_case/camelCase. Functions in `api.ts` handle this with fallbacks. Use `normalizeImageUrl()` for images.

**Cross-platform shadows:** Web uses `boxShadow`, Native uses `shadowColor`/`shadowOffset`/etc.

**State:** Local hooks only (`useState`, `useEffect`). Auth state lives in `App.tsx` with AsyncStorage persistence. Use `useFocusEffect` to refresh data when returning to a screen.

## Authentication

- Token stored in AsyncStorage under key `token`
- Login state under key `haaze_logged_in`
- Axios interceptor auto-adds `Authorization: Bearer {token}`

## NFC Integration

- Custom plugins at `plugins/withNfc.js` and `plugins/withAndroidProviders.js` configure Android/iOS permissions
- Uses `react-native-nfc-manager` with conditional import for Expo Go support
- Error codes: `NFC_ALREADY_LINKED`, `ALL_ITEMS_LINKED`, `CLOTHING_NOT_IN_ORDER`, `ORDER_NOT_OWNED`

**NFC linking flow:** OrdersScreen → OrderDetailScreen (select clothing) → NFCLinkScreen (scan NFC)

## Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/me` | GET | Current user with vetements and orders |
| `/missions` | GET | List missions |
| `/collections` | GET | List collections |
| `/skins` | GET | Available skins |
| `/clothes` | GET | Clothing catalog |
| `/orders` | GET | User orders with linking status |
| `/orders/{id}/unlinked-clothes` | GET | Remaining items to link |
| `/orders/{id}/scan-nfc` | POST | Link clothing via NFC (body: `clothing_id`, `nfc_id`) |

## Backend

Laravel API at https://github.com/Mathieu-XAVIER/lara-haaze
Production: `https://haaze.mathieu-xavier.fr/api`

See `AGENTS.md` for detailed French documentation and data models.

### Backend Specification Rule

**IMPORTANT:** Lorsque vous identifiez une fonctionnalité, route API, ou donnée manquante dans le backend Laravel, vous DEVEZ créer un fichier de spécification dans le dossier `.backend-specs/` avec le format suivant:

**Nom du fichier:** `.backend-specs/YYYY-MM-DD-nom-fonctionnalite.md`

**Structure du fichier:**
```markdown
# [Titre de la fonctionnalité]

**Date:** YYYY-MM-DD
**Priorité:** [Haute/Moyenne/Basse]
**Impact:** [Description de l'impact sur l'app mobile]

## Contexte

[Expliquer pourquoi cette fonctionnalité est nécessaire et dans quel contexte elle sera utilisée dans l'app mobile]

## Route(s) API attendue(s)

### [Méthode HTTP] /api/endpoint

**Description:** [À quoi sert cette route]

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Query params:** (si applicable)
- `param_name` (type) - description

**Body:** (si applicable)
```json
{
  "field_name": "type - description"
}
```

**Réponse attendue (200):**
```json
{
  "data": {
    "field_name": "type - description"
  }
}
```

**Erreurs possibles:**
- `404` - Message d'erreur
- `422` - Message d'erreur de validation

## Modèles/Relations concernés

[Liste des modèles Eloquent impactés: User, Vetement, Order, Mission, etc.]

## Validations attendues

[Liste des règles de validation Laravel nécessaires]

## Logique métier

[Description détaillée de la logique à implémenter côté backend]

## Impact base de données

[Migrations nécessaires, nouveaux champs, nouvelles tables, relations à ajouter]

## Notes supplémentaires

[Toute autre information utile pour l'implémentation]
```

Cette spécification servira de cahier des charges pour l'équipe Laravel.
