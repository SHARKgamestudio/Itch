# 🎨 Thème CSS itch.io — déploiement automatique via GitHub Pages

Ce dépôt contient le **CSS source** de ton thème itch.io. À chaque `push` sur `main`, une GitHub Action :

1. **minifie** `src/style.css` → `dist/style.min.css` (via [csso](https://github.com/css/csso)) ;
2. **déploie** le dossier `dist/` sur **GitHub Pages**.

Dans l'éditeur de thème itch.io, tu n'ajoutes **qu'une seule fois** une ligne `@import`. Comme l'URL ne change jamais, toutes tes futures modifications se font en éditant `src/style.css` puis en poussant — **plus besoin de retoucher itch.io**.

---

## Structure du dépôt

| Chemin | Rôle |
| --- | --- |
| `src/style.css` | **Ton thème** — le seul fichier à éditer |
| `scripts/build.js` | Script de build : minifie le CSS et prépare `dist/` |
| `package.json` | Dépendances (csso) et commande `npm run build` |
| `.github/workflows/deploy-pages.yml` | GitHub Action : build + déploiement Pages |
| `dist/` | Sortie générée (ignorée par git, produite par l'action) |

---

## 1. Mise en place (une seule fois)

### 1.1 Activer GitHub Pages

1. Sur GitHub, ouvre le dépôt → **Settings** → **Pages** (menu de gauche).
2. Dans **Build and deployment** → **Source** : choisis **GitHub Actions**.
   > ⚠️ Pour un compte gratuit, le dépôt doit être **public** pour que GitHub Pages fonctionne.

### 1.2 Premier déploiement

Pousse le code sur `main` (ou, une fois le code poussé, lance le workflow manuellement :
**Actions** → *Build & Deploy CSS to GitHub Pages* → **Run workflow**).

### 1.3 Récupérer l'URL du CSS

Le CSS est servi à cette adresse **fixe** :

```
https://SHARKgamestudio.github.io/Itch/style.min.css
```

Vérification : ouvre cette URL dans ton navigateur, tu dois voir le CSS minifié
(et `https://SHARKgamestudio.github.io/Itch/version.txt` doit afficher le hash du commit).

---

## 2. Brancher itch.io (une seule fois)

1. Va sur la page à personnaliser sur itch.io → **Edit** (ou *Edit game*) → onglet **Theme**.
2. Active **Custom CSS**.
3. Colle **en toute première ligne** du champ CSS :

   ```css
   @import url('https://SHARKgamestudio.github.io/Itch/style.min.css');
   ```

   > ⚠️ L'`@import` doit être la **toute première** règle du bloc CSS pour être valide.
4. **Save**. Ton thème est appliqué.

---

## 3. Workflow quotidien (automatique)

1. Édite `src/style.css` (couleurs, sélecteurs, layout…).
2. Pousse sur `main` :

   ```bash
   git add .
   git commit -m "Mise à jour du thème"
   git push
   ```

3. La GitHub Action build + déploie automatiquement (~1 min).
4. Recharge ta page itch.io (**Ctrl+F5** pour contourner le cache).

C'est tout : tu ne retouches plus jamais l'éditeur de thème itch.io.

---

## 4. Dépannage

| Problème | Solution |
| --- | --- |
| L'action échoue à *"Environment github-pages not found"* | Active Pages avec la source **GitHub Actions** (Settings → Pages, étape 1.1), puis relance le workflow. |
| L'`@import` ne semble pas appliqué | Vérifie qu'il est la **première ligne** du champ Custom CSS et que l'URL est correcte (casse du nom de dépôt). |
| Modifs pas visibles après un push | GitHub Pages peut prendre ~1 min. Fais un **hard refresh** (Ctrl+F5 / Cmd+Shift+R). Si le cache persiste, ajoute `?v=2` à la fin de l'URL dans l'`@import` (en dernier recours). |
| Pas de déploiement après push | Vérifie que la branche par défaut est `main` (sinon adapte `branches:` dans `.github/workflows/deploy-pages.yml`). |
| Test en local | `npm install` puis `npm run build` → résultat dans `dist/style.min.css`. |
