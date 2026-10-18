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

**RevenueCat**
- [ ] 👤 Créer une **clé API secrète (v1)** — ne jamais la mettre dans l'app ni dans `.env`

**Supabase** (pour les cadeaux)
- [ ] 👤 Exécuter `supabase/migrations/20261018000000_gifts.sql` (coller dans l'éditeur SQL)
- [ ] 👤 Enregistrer la clé : `npx supabase secrets set REVENUECAT_SECRET_KEY=sk_…`
- [ ] 👤 Déployer : `npx supabase functions deploy claim-gift`

## Étape 2 — Intégrer les pubs dans le code (🤖, dès réception des identifiants)

- [ ] 🤖 Vérifier la version de `react-native-google-mobile-ads` compatible Expo SDK 57, l'installer et la configurer
- [ ] 🤖 Message de consentement (RGPD) + fenêtre de suivi Apple (ATT) + lien « Gérer mes choix » dans les Réglages
- [ ] 🤖 Vraie vidéo récompensée pour « Essayer un pack » (remplace `src/lib/ads.ts`)
- [ ] 🤖 Interstitiel de fin de partie : 1 partie sur 2, rien les 3 premières parties, rien si partie quittée
- [ ] 🤖 Texte ATT et liste SKAdNetwork dans `app.json`

## Étape 3 — Tester sur ton téléphone (👤 + 🤖)

- [ ] 🤖 Lancer un build de développement (`eas build --profile development`) — Expo Go ne peut pas tester pubs, achats ni cadeaux
- [ ] 👤 Tester : essai de pack par pub, proposition d'achat en fin d'essai, achat réel (sandbox)
- [ ] 👤 Tester : cadeau de bienvenue (après 3 parties), partage + pack offert, « Restaurer les achats »
- [ ] 👤 Tester : demande d'avis (après 3 parties ; absente sur TestFlight)
- [ ] 👤 Tester : interstitiel en fin de partie avec les pubs de test

## Étape 4 — Légal, avant la mise en ligne (👤)

- [ ] 👤 Site, page Confidentialité : retirer « Aucune publicité », ajouter AdMob, les données collectées, le consentement, les cadeaux
- [ ] 👤 Site : publier `app-ads.txt` (contenu fourni par AdMob) à la racine du site déclaré sur l'App Store
- [ ] 👤 App Store Connect : « Confidentialité de l'app » → déclarer les données utilisées pour la publicité
- [ ] 👤 Vérifier la classification d'âge de l'app

## Étape 5 — Publier (👤 + 🤖)

- [ ] 🤖 Fusionner la branche `feat/cadeaux-avis` (elle contient aussi `feat/publicite`) dans `master`
- [ ] 🤖 Build de production + envoi à l'App Store
- [ ] 👤 Notes « Nouveautés » de la version

## Plus tard

- [ ] Android : identifiant d'app, lien Play Store, déclaration « Contient des annonces », « Sécurité des données »
- [ ] Achat « Retirer les pubs »
- [ ] Médiation pub (quand les revenus pub dépassent ~100 $/mois)
- [ ] Boutique : configurer les vrais produits (App Store Connect + RevenueCat + `src/config/shop.ts`) une fois l'UI finalisée
- [ ] Nouveau pack → le déclarer dans `PACK_THEME_IDS` (app) et `GIFTABLE_ENTITLEMENTS` (fonction Supabase)
