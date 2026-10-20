# TODO Banco — Publicités, cadeaux, avis

👤 = à faire par toi · 🤖 = à faire par Claude · Coche `[x]` au fur et à mesure.
Détails techniques : `docs/banco-doc.html` (sections « Publicité » et « Cadeaux & avis »).

## Étape 1 — Créer les comptes et réglages (👤, aucun code)

**Google AdMob**
- [x] 👤 Créer le compte AdMob
- [x] 👤 Ajouter l'app iOS (« non publiée » pour l'instant ; Android plus tard)
- [x] 👤 Créer l'emplacement « Essayer un pack » → type **Récompensé**
- [x] 👤 Créer l'emplacement « Fin de partie » → type **Interstitiel**
- [ ] 👤 Vérifier dans l'emplacement « Fin de partie » : **image et texte seulement** (vidéo décochée) + fréquence max (ex. 1 toutes les 10 min)
- [ ] 👤 **« Confidentialité et messages »** : créer et publier le message **RGPD** et le message **« explication IDFA »** (fenêtre de suivi Apple), pour l'app Banco iOS — ⚠️ la page ne chargeait pas le 2026-10-20 : essayer en navigation privée, bloqueur de pub désactivé (uBlock, Brave…), un seul compte Google connecté, Chrome ; sinon réessayer plus tard (compte tout neuf). Non bloquant pour les tests, obligatoire avant la mise en ligne
- [ ] 👤 Relire la politique AdMob sur les annonces avec récompense (texte « Jouez gratuitement avec ce pack »)
- [x] 👤 Identifiants envoyés : app iOS `~4845563686`, « Essayer un pack » `/2385640044`, « Fin de partie » `/5963204236`
- [ ] 👤 Infos de paiement AdMob (avant le 1er versement, ~70 €) : type **Particulier ou Organisation : pas encore tranché** (piste : Organisation via la micro-entreprise, après avoir déclaré l'activité « édition d'applications » sur le guichet unique INPI ; catégorie fiscale à valider avec un comptable / l'URSSAF) — choix quasi définitif chez Google ; même nom que le compte Apple et App Store Connect
- [ ] 👤 Après la publication par Apple : AdMob → app → **Associer à une plate-forme de téléchargement** (lance l'examen AdMob, quelques jours)

Le pack de bienvenue n'a besoin d'aucun réglage : il est enregistré sur le téléphone, sans compte ni serveur.

## Étape 2 — Intégrer les pubs dans le code (🤖)

- [x] 🤖 `react-native-google-mobile-ads` 17.3.1 installé et configuré (identifiants d'app de **test** Google dans `app.json`)
- [x] 🤖 Consentement RGPD (Google UMP) au démarrage + lien « Choix publicitaires » dans les Réglages quand il est exigé
- [x] 🤖 Vraie vidéo récompensée pour « Essayer un pack » (`src/lib/ads.ts`)
- [x] 🤖 Interstitiel de fin de partie : à partir de la 4e partie, 1 sur 2, en quittant l'écran final ; jamais si partie quittée ni après un essai
- [x] 🤖 Texte ATT et liste SKAdNetwork (50 identifiants Google) dans `app.json`
- [ ] 👤 AdMob → « Confidentialité et messages » : créer le message RGPD **et** le message « explication IDFA » (c'est lui qui déclenche la fenêtre de suivi Apple)
- [x] 🤖 Identifiants réels iOS en place (`app.json` + `src/config/ads.ts`) ; Android reste l'ID de test Google
- [x] 🤖 Clé RevenueCat aussi dans le profil `development` d'`eas.json`

## Étape 3 — Tester sur ton téléphone (👤 + 🤖)

- [ ] 👤 Build de développement — Expo Go ne peut pas tester pubs, achats ni cadeaux :
  1. `npx eas-cli@latest device:create` (une fois, enregistre l'iPhone)
  2. `npx eas-cli@latest build --profile development --platform ios`
  3. installer l'app, puis `npx expo start --dev-client`
- [ ] 👤 Tester : essai de pack par pub, proposition d'achat en fin d'essai, achat réel (sandbox)
- [ ] 👤 + 🤖 Pack de bienvenue / cadeau : **à trancher** — le code (`useGifts`) décrit un cadeau « contre un partage », la carte boutique a été retirée ; décider ce qu'on garde avant de tester
- [ ] 👤 Tester : demande d'avis (après 3 parties ; absente sur TestFlight)
- [ ] 👤 Tester : interstitiel en fin de partie avec les pubs de test

## Étape 4 — Légal, avant la mise en ligne (👤)

- [ ] 👤 App Store Connect : Tauk ! (soumise le 10/10) et Banco (16/10) toujours « En attente de vérification » le 20/10 → message envoyé à App Review ; vérifier la page Adhésion (developer.apple.com/account) et « Accords, taxes et services bancaires » (accord **apps payantes** actif, requis pour les achats intégrés)
- [ ] 👤 App Store Connect : configurer les produits (achats intégrés) + RevenueCat — sinon la boutique affiche le prix de référence et l'achat échoue
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
