# Haaze

## Configuration de l'API Laravel

1. Copier `env.example` vers un fichier `.env` à la racine du projet.
2. Mettre à jour `EXPO_PUBLIC_API_URL` avec l’URL publique de votre API Laravel (par exemple `http://192.168.0.10:8000/api` si vous utilisez un appareil physique).
3. Redemarrer Metro (`npm start -- --clear`) pour que la nouvelle valeur soit prise en compte.

L'application utilise desormais cette variable pour initialiser Axios. Sans valeur valide, la connexion essaiera d'atteindre `http://127.0.0.1:8000/api`, ce qui echouera si votre backend tourne sur une autre machine ou derriere un autre port.

## Dépannage de la connexion

- Verifiez que `php artisan serve --host=0.0.0.0 --port=8000` est en cours d'execution et accessible depuis votre emulateur/appareil.
- Assurez-vous que Laravel retourne bien un JSON `{ token: "..." }` sur `POST /api/login`. Le token est stocke dans `AsyncStorage` pour authentifier toutes les requetes suivantes.
- Utilisez `npx expo start --tunnel` si vous devez exposer votre API hors de votre reseau local.

## Polices personnalisees

1. Les polices Special Gothic Expanded One (titres) et Manrope (paragraphes) sont embarquees via `@expo-google-fonts`. Aucun backend ni hebergement externe n'est requis.
2. Si tu ajoutes d'autres variantes (gras, italique, etc.), importe-les dans `hooks/useAppFonts.ts` et enregistre-les dans `useFonts`.
3. Redemarrez Metro apres toute modification (`npm start -- --clear`) pour recharger les polices.

Le hook `useAppFonts` bloque l'affichage tant que les polices ne sont pas chargees. En cas d'erreur de chargement, un warning `[Fonts]` apparait dans la console Metro.

