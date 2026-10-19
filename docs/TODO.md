# TODO Banco — Publicités, cadeaux, avis

👤 = à faire par toi · 🤖 = à faire par Claude · Coche `[x]` au fur et à mesure.
Détails techniques : `docs/banco-doc.html` (sections « Publicité » et « Cadeaux & avis »).

## Étape 1 — Créer les comptes et réglages (👤, aucun code)

**Google AdMob**
- [ ] 👤 Créer le compte AdMob (infos fiscales et bancaires : possible plus tard, avant le 1er paiement)
- [ ] 👤 Ajouter l'app iOS (Android plus tard)
- [ ] 👤 Créer l'emplacement « Essayer un pack » → type **Récompensé**
- [ ] 👤 Créer l'emplacement « Fin de partie » → type **Interstitiel**, **image et texte seulement** (décocher la vidéo)
- [ ] 👤 Régler la fréquence maximale de l'interstitiel
- [ ] 👤 Configurer le message de consentement RGPD (« Confidentialité et messages »)
- [ ] 👤 Relire la politique AdMob sur les annonces avec récompense (texte « Jouez gratuitement avec ce pack »)
- [ ] 👤 **M'envoyer** : l'identifiant de l'app iOS + les 2 identifiants d'emplacements

Le pack de bienvenue n'a besoin d'aucun réglage : il est enregistré sur le téléphone, sans compte ni serveur.

## Étape 2 — Intégrer les pubs dans le code (🤖)

- [x] 🤖 `react-native-google-mobile-ads` 17.3.1 installé et configuré (identifiants d'app de **test** Google dans `app.json`)
- [x] 🤖 Consentement RGPD (Google UMP) au démarrage + lien « Choix publicitaires » dans les Réglages quand il est exigé
- [x] 🤖 Vraie vidéo récompensée pour « Essayer un pack » (`src/lib/ads.ts`)
- [x] 🤖 Interstitiel de fin de partie : à partir de la 4e partie, 1 sur 2, en quittant l'écran final ; jamais si partie quittée ni après un essai
- [x] 🤖 Texte ATT et liste SKAdNetwork (50 identifiants Google) dans `app.json`
- [ ] 👤 AdMob → « Confidentialité et messages » : créer le message RGPD **et** le message « explication IDFA » (c'est lui qui déclenche la fenêtre de suivi Apple)
- [ ] 🤖 Remplacer les identifiants de test : app iOS/Android dans `app.json`, emplacements dans `src/config/ads.ts`

## Étape 3 — Tester sur ton téléphone (👤 + 🤖)

- [ ] 🤖 Lancer un build de développement (`eas build --profile development`) — Expo Go ne peut pas tester pubs, achats ni cadeaux
- [ ] 👤 Tester : essai de pack par pub, proposition d'achat en fin d'essai, achat réel (sandbox)
- [ ] 👤 Tester : pack de bienvenue (fenêtre sur l'accueil après 3 parties, carte « Votre pack de bienvenue » dans la boutique)
- [ ] 👤 Tester : demande d'avis (après 3 parties ; absente sur TestFlight)
- [ ] 👤 Tester : interstitiel en fin de partie avec les pubs de test

## Étape 4 — Légal, avant la mise en ligne (👤)

- [ ] 👤 Site, page Confidentialité : retirer « Aucune publicité », ajouter AdMob, les données collectées, le consentement ; **retirer les comptes** (Supabase, connexion Apple/Google, suppression de compte), y compris dans la FAQ de la page Assistance
- [ ] 👤 Site : publier `app-ads.txt` (contenu fourni par AdMob) à la racine du site déclaré sur l'App Store
- [ ] 👤 App Store Connect : « Confidentialité de l'app » → déclarer les données utilisées pour la publicité
- [ ] 👤 Vérifier la classification d'âge de l'app

## Étape 5 — Publier (👤 + 🤖)

- [ ] 🤖 Fusionner la branche `feat/cadeaux-avis` (elle contient aussi `feat/publicite`) dans `master`
- [ ] 🤖 Build de production + envoi à l'App Store
- [ ] 👤 Notes « Nouveautés » de la version

## Idées — soirée (à cadrer avant de coder)

- [ ] Pack payant « Alcool » : même esprit que le pack « Sexe », des questions de soirée autour de l'alcool (pas un quiz sur les marques)
- [ ] Pack payant « Sexe » (questions coquines)
- [ ] Mode « Gages » en survie : l'équipe qui sèche (PAS DE RÉPONSE ou temps écoulé) tire un gage à réaliser — liste de gages à écrire, option on/off dans les paramètres de la survie
- [ ] ⚠️ Avant de lancer : ces contenus font passer **toute l'app** en 17+ sur l'App Store (et adaptent la classification Play Store) ; Apple refuse ce qui pousse à boire beaucoup (pas de gage « bois un verre ») ; vérifier aussi les règles AdMob sur les contenus adultes (sinon pas de pub sur ces packs) — envisager un avertissement « réservé aux adultes » à l'ouverture du pack

## Plus tard

- [ ] Android : identifiant d'app, lien Play Store, déclaration « Contient des annonces », « Sécurité des données »
- [ ] Achat « Retirer les pubs »
- [ ] Médiation pub (quand les revenus pub dépassent ~100 $/mois)
- [ ] Boutique : configurer les vrais produits (App Store Connect + RevenueCat + `src/config/shop.ts`) une fois l'UI finalisée
- [ ] Nouveau pack → le déclarer dans `PACK_THEME_IDS` (`src/config/shop.ts`) : il devient aussi proposable en pack de bienvenue
- [x] 👤 Écran compte (`/auth`) supprimé avec Supabase, Apple Sign-In et Google Sign-In : l'app fonctionne entièrement sans compte
