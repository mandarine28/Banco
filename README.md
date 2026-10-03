# Devineuf

Jeu mobile d'ambiance par équipes, développé avec Expo (React Native + TypeScript, Expo Router).

## Lancer le projet

```bash
npm install
npx expo start        # puis scanner le QR code avec Expo Go, ou touche « w » pour le navigateur
npm run typecheck
npm test             # tests de la logique de jeu
```

## Structure

- `src/app/` : écrans (une route par fichier)
- `src/components/` : composants réutilisables (boutons, logo, fond)
- `src/theme/` : couleurs et polices
- `src/config/` : liens externes, offres de la boutique
- `src/game/` : logique de partie (tours, points, classement), sans interface
- `src/data/` : questions et thèmes

## Ajouter des questions

Les questions sont dans `src/data/questions.ts` (les actuelles sont des exemples).
Chaque question a un thème (`src/data/themes.ts`), un intitulé et exactement 9 réponses,
chacune avec ses points (1 = évidente, 5 = rare). `npm test` vérifie le format.

```ts
{
  id: 'pizzas',
  theme: 'cuisine',
  prompt: 'CITEZ 9 TYPES DE PIZZAS',
  answers: [{ label: 'MARGHERITA', points: 1 }, /* … 9 réponses */],
}
```
