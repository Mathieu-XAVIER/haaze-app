# AGENTS.md

Instructions pour les agents IA travaillant sur ce projet.

## Description du projet

**Haaze** est une application mobile React Native/Expo permettant aux utilisateurs de gérer leur collection de vêtements connectés via NFC. L'application intègre un système de gamification avec des missions, de l'XP, des niveaux et des skins personnalisables.

## Stack technique

- **Framework**: React Native 0.81 avec Expo SDK 54
- **Langage**: TypeScript (mode strict)
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **Styling**: StyleSheet natif + `expo-linear-gradient`
- **État**: Hooks React locaux (`useState`, `useEffect`)
- **Stockage local**: `@react-native-async-storage/async-storage`
- **HTTP Client**: Axios
- **NFC**: `react-native-nfc-manager`
- **Polices**: `@expo-google-fonts` (SpecialGothicExpandedOne, Manrope)

## Structure du projet

```
/
├── App.tsx                 # Point d'entrée, gestion auth + navigation racine
├── app.config.ts           # Configuration Expo dynamique
├── index.ts                # Enregistrement du composant racine
├── components/             # Composants réutilisables
│   ├── ClothingCard.tsx
│   ├── MissionCard.tsx
│   ├── Navbar.tsx
│   └── SectionTitle.tsx
├── screens/                # Écrans de l'application
│   ├── HomeScreen.tsx
│   ├── MissionsScreen.tsx
│   ├── CollectionScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── LoginScreen.tsx
│   ├── ScanScreen.tsx
│   ├── AddClothingScreen.tsx
│   └── LinkClothingScreen.tsx
├── navigation/             # Configuration de la navigation
│   └── BottomTabs.tsx
├── services/               # Logique API et services
│   └── api.ts              # Client Axios + endpoints + interfaces TypeScript
├── hooks/                  # Hooks personnalisés
│   └── useAppFonts.ts
├── styles/                 # Styles partagés
│   ├── theme.ts            # Couleurs et polices (COLORS, FONTS)
│   └── MissionCard.styles.ts
├── assets/                 # Images, icônes, SVG
└── android/                # Code natif Android
```

## Conventions de code

### Nommage

- **Composants**: PascalCase (`MissionCard.tsx`)
- **Hooks**: camelCase avec préfixe `use` (`useAppFonts.ts`)
- **Fichiers de style**: kebab-case avec suffixe `.styles.ts`
- **Interfaces TypeScript**: PascalCase, définies dans `services/api.ts`

### Patterns de composants

- Composants fonctionnels avec hooks React
- Props typées avec interfaces TypeScript
- Styles définis via `StyleSheet.create()` en bas du fichier
- Gestion des ombres cross-platform (Web vs Native) avec objets conditionnels

### Gestion de l'API

Le fichier `services/api.ts` contient :
- Une instance Axios configurée avec intercepteurs (auth token)
- Des fonctions d'API exportées (`getUser`, `getMissions`, `getSkins`, etc.)
- Des interfaces TypeScript pour les types de données (`User`, `Mission`, `Vetement`, etc.)
- Une normalisation des URLs d'images via `normalizeImageUrl()`

**Important**: L'API Laravel peut retourner des données dans différents formats (snake_case/camelCase). Le code gère ces variations avec des fallbacks multiples.

### Thème et couleurs

Utiliser les constantes de `styles/theme.ts` :

```typescript
import { COLORS, FONTS } from '../styles/theme';

// Couleurs principales
COLORS.primaryBlue    // #3300FD (bleu principal)
COLORS.accentYellow   // #F0F600 (jaune accent)
COLORS.textDark       // #1c1c1c (texte foncé)
COLORS.backgroundLight // #fdfbff (fond clair)

// Polices
FONTS.title     // SpecialGothicExpandedOne (titres)
FONTS.body      // Manrope-Regular (paragraphes)
FONTS.bodyBold  // Manrope-SemiBold (texte gras)
```

## Commandes

```bash
# Démarrage du serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Lancer en mode web
npm run web

# Build iOS (développement)
npm run build:ios:dev

# Build iOS (preview)
npm run build:ios:preview

# Mode dev-client
npm run dev-client
```

## Configuration de l'environnement

1. Copier `env.example` vers `.env`
2. Configurer `EXPO_PUBLIC_API_URL` avec l'URL de l'API Laravel
3. Redémarrer Metro avec `npm start -- --clear`

## Endpoints API principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/me` | GET | Récupérer l'utilisateur connecté |
| `/missions` | GET | Liste des missions |
| `/collections` | GET | Liste des collections |
| `/skins` | GET | Liste des skins disponibles |
| `/clothes` | GET | Catalogue des vêtements |
| `/clothes/{id}` | GET | Détails d'un vêtement |
| `/nfc/check/{nfcId}` | GET | Vérifier un tag NFC |
| `/clothes/link` | POST | Lier un vêtement via NFC |
| `/orders/lookup` | POST | Rechercher une commande |
| `/orders/{id}/link-clothes` | POST | Lier les vêtements d'une commande |

## Authentification

- Token JWT stocké dans AsyncStorage sous la clé `token`
- État de connexion dans AsyncStorage sous `haaze_logged_in`
- L'intercepteur Axios ajoute automatiquement le header `Authorization: Bearer {token}`

## Points d'attention

### Gestion des erreurs API

Les fonctions API retournent des valeurs par défaut en cas d'erreur (tableaux vides, objets avec valeurs par défaut) plutôt que de propager les exceptions. Les composants doivent gérer les états vides gracieusement.

### Images et médias

Les URLs d'images de l'API peuvent avoir différents formats. La fonction `normalizeImageUrl()` dans `api.ts` gère la normalisation. Les images peuvent provenir de :
- Chemin absolu HTTP/HTTPS
- Chemin relatif `/storage/...`
- Objet media avec propriété `original_url`, `url`, ou `full_url`

### NFC

- Plugin personnalisé dans `plugins/withNfc.js`
- Permissions configurées dans `app.config.ts` (iOS: `NFCReaderUsageDescription`)
- Utilise `react-native-nfc-manager` pour la lecture des tags

### Polices personnalisées

- Chargées via `useAppFonts()` hook
- L'application bloque le rendu jusqu'au chargement des polices
- En cas d'erreur, un warning `[Fonts]` apparaît dans la console

## Projet API Laravel associé

Cette application mobile dépend d'une API Laravel backend :
- **Dépôt**: https://github.com/Mathieu-XAVIER/lara-haaze
- **URL de production**: `https://haaze.mathieu-xavier.fr/api`

### Intégration du contexte Laravel

Pour permettre aux agents IA de comprendre la logique complète, clonez le dépôt Laravel dans ce workspace :

```bash
# Option 1 : Submodule Git
git submodule add https://github.com/Mathieu-XAVIER/lara-haaze.git api

# Option 2 : Clone simple (sans historique git lié)
git clone https://github.com/Mathieu-XAVIER/lara-haaze.git api
echo "api/" >> .gitignore
```

Une fois cloné, les agents pourront explorer :
- `api/routes/api.php` - Définition des routes API
- `api/app/Http/Controllers/` - Logique des endpoints
- `api/app/Models/` - Modèles Eloquent et relations
- `api/database/migrations/` - Structure de la base de données

### Structure attendue de l'API

| Modèle | Description |
|--------|-------------|
| `User` | Utilisateur avec niveau, XP, vêtements |
| `Clothing` | Vêtement du catalogue |
| `UserClothing` | Pivot user-clothing avec NFC |
| `Mission` | Mission avec progression |
| `Collection` | Collection de vêtements |
| `Skin` | Skin personnalisable |
| `Order` | Commande contenant des vêtements |
| `NfcTag` | Tag NFC lié à un vêtement |

---

## Bonnes pratiques

1. **Toujours utiliser le thème** pour les couleurs et polices
2. **Typer les props** de tous les composants
3. **Gérer les états vides** dans l'UI (empty states)
4. **Préférer `Promise.allSettled`** pour les appels API parallèles
5. **Éviter les `any`** - utiliser les interfaces définies dans `api.ts`
6. **Tester sur iOS et Android** - les ombres se comportent différemment
7. **Utiliser `useFocusEffect`** pour rafraîchir les données au retour sur un écran
