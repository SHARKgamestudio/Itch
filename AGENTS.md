# Instructions pour les agents travaillant sur ce dépôt

Ce dépôt déploie un thème CSS pour la page itch.io de SHARKgamestudio
via GitHub Pages (build + déploiement automatiques).

## Règles

- **Le seul fichier à modifier** est `src/style.css`.
- Ne modifie **jamais** l'URL d'`@import` déjà en place dans l'éditeur de thème itch.io :
  `@import url('https://SHARKgamestudio.github.io/Itch/style.min.css');`
  Cette URL doit rester stable pour que les déploiements restent automatiques.
- `dist/` et `node_modules/` sont ignorés par git — ne les modifie pas à la main.

## Déployer

Après avoir modifié `src/style.css` :

1. Test local (optionnel) : `npm install && npm run build` → vérifie `dist/style.min.css`.
2. Commit + push sur `main` → la GitHub Action (`.github/workflows/deploy-pages.yml`)
   build et déploie automatiquement sur GitHub Pages (~1 min).

## Vérifier que le déploiement est correct — OBLIGATOIRE

Après un push, tu dois vérifier que le thème est bien déployé et rendu correctement :

1. Récupère le contenu de la page : **https://sharkgamestudio.itch.io/**
   (et si besoin, l'URL du CSS : https://SHARKgamestudio.github.io/Itch/style.min.css
   ainsi que https://SHARKgamestudio.github.io/Itch/version.txt pour connaître le hash du commit déployé).
2. Contrôle que le CSS minifié déployé contient bien les changements attendus
   (ex. la couleur de fond).
3. Contrôle que la page itch.io est rendue avec le thème attendu (aucun style cassé).

### Pièges connus

- **itch.io est protégé par Cloudflare** (« Just a moment… » / « Performing security verification »).
  Un simple fetch HTTP peut renvoyer 403 et un navigateur headless peut rester bloqué sur le challenge.
  - Si c'est le cas, tu peux quand même vérifier l'essentiel via GitHub Pages :
    `https://SHARKgamestudio.github.io/Itch/style.min.css` (doit contenir les changements attendus)
    et `https://SHARKgamestudio.github.io/Itch/version.txt` (doit contenir le hash du dernier commit).
  - Pour l'apparence réelle sur itch.io, utilise un vrai navigateur (rendu + console) et
    vérifie dans la console que le chargement de `style.min.css` ne renvoie pas d'erreur
    (un `ERR_BLOCKED_BY_ORB` signifie que GitHub Pages renvoie 404 = déploiement KO).
- **Réponse 404 sur `https://SHARKgamestudio.github.io/Itch/...`** = le site n'est PAS déployé.
  Causes possibles : dépôt privé (Pages gratuit nécessite un dépôt public), Pages non activé
  avec la source « GitHub Actions », ou workflow encore en cours (~1 min).
- **Cache navigateur** : même après un déploiement réussi, l'URL stable `style.min.css` peut rester
  servie depuis le cache du navigateur (ancien thème). Pour connaître la vérité côté serveur, ajoute
  un cache-buster et force le no-store : `fetch(url + '?v=' + Date.now(), { cache: 'no-store' })`.
  Si ça renvoie le nouveau contenu → déploiement OK, c'est juste le cache local (hard refresh Ctrl+F5).
- **API GitHub en 404** (`api.github.com/repos/SHARKgamestudio/Itch/...`) = dépôt privé (données masquées).

Si quelque chose ne correspond pas, signale-le à l'utilisateur au lieu de considérer la tâche terminée.
