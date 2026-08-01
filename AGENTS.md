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

Si quelque chose ne correspond pas, signale-le à l'utilisateur au lieu de considérer la tâche terminée.
