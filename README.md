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

## Règles d'un round

1. **Enchères** : seul le thème est affiché. Chaque équipe, à tour de rôle, mise le nombre de
   réponses (1 à 9) qu'elle s'engage à trouver, ou passe (elle sort alors de l'enchère).
   L'équipe qui ouvre doit miser ; l'ouverture tourne à chaque round. Une mise de 9 clôt l'enchère.
2. **Réponse** : la question est révélée, l'équipe qui a la plus haute mise a 60 s.
   L'adversaire (dernière équipe surenchérie) tient l'appareil : le compteur part de la mise
   et descend à chaque bonne réponse (boutons de réponses connues, recherche dans la base,
   vérification Wikipédia, ou « − » pour une réponse hors base).
3. **Score** : mise atteinte = l'équipe gagne sa mise en points ; sinon l'adversaire la récupère.

## Ajouter des questions

Les questions sont dans `src/data/questions.ts` (les actuelles sont des exemples).
Chaque question a un thème (`src/data/themes.ts`), un intitulé et la liste des réponses
acceptées, **de la plus citée à la moins citée** : les 27 premières s'affichent en boutons,
la barre de recherche parcourt toute la liste (accents, casse et tirets ignorés).
`npm test` vérifie le format (27 réponses minimum, pas de doublon).

```ts
{
  id: 'super-heros',
  theme: 'cinema',
  subject: 'SUPER-HÉROS', // affiché « CITEZ <mise> SUPER-HÉROS »
  answers: ['SPIDER-MAN', 'BATMAN', 'SUPERMAN', /* … */],
}
```
