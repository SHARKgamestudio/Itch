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
4. Recharge ta page itch.io :
   - **Avec Cloudflare Pages** (section 4) : rien à faire, le CSS est revalidé à chaque chargement.
   - **Avec GitHub Pages uniquement** : fais **Ctrl+F5** pour contourner le cache (max ~10 min).

C'est tout : tu ne retouches plus jamais l'éditeur de thème itch.io.

---

## 4. (Recommandé) Fixer le cache navigateur avec Cloudflare Pages

**Le problème** : GitHub Pages sert `style.min.css` avec `Cache-Control: max-age=600`
(10 min) et n'autorise pas d'en-têtes personnalisés. Après chaque déploiement, le
navigateur peut donc afficher l'ancien thème jusqu'à ~10 min (Ctrl+F5 pour forcer).

**La solution** : servir le CSS depuis **Cloudflare Pages** (gratuit, fiable, sans
limite de bande passante). Il envoie `Cache-Control: no-cache` → le navigateur
**revalide à chaque chargement** : chaque déploiement est visible immédiatement,
sans Ctrl+F5. L'`@import` reste une URL **stable** et 100 % automatique.

### 4.1 Créer le projet Cloudflare Pages (une seule fois, ~5 min)

1. Crée un compte gratuit sur https://dash.cloudflare.com (e-mail + mot de passe).
2. Menu **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Choisis le dépôt `SHARKgamestudio/Itch` → **Begin setup**.
4. Paramètres de build :
   - **Build command** : `npm ci && npm run build`
   - **Build output directory** : `dist`
5. **Save and Deploy**. Le site est publié sur `https://itch-dhr.pages.dev`.

> Le fichier `dist/_headers` (généré automatiquement par `npm run build`) contient
> `Cache-Control: no-cache` → Cloudflare Pages force la revalidation du navigateur.

### 4.2 Nouvelle URL du CSS (stable)

```
https://itch-dhr.pages.dev/style.min.css
```

Vérification : `https://itch-dhr.pages.dev/version.txt` doit afficher le hash du commit.

### 4.3 Mettre à jour l'`@import` itch.io (une seule fois)

Dans l'éditeur de thème itch.io, remplace la première ligne par :

```css
@import url('https://itch-dhr.pages.dev/style.min.css');
```

L'URL ne change plus jamais → le flux reste automatique, et chaque push est visible
**immédiatement** (plus de Ctrl+F5).

> 💡 GitHub Pages reste actif en parallèle (fallback) — l'URL `...github.io/...`
> continue de fonctionner, elle est juste sujette au cache de 10 min.

---

## 4. Dépannage

| Problème | Solution |
| --- | --- |
| L'action échoue à *"Environment github-pages not found"* | Active Pages avec la source **GitHub Actions** (Settings → Pages, étape 1.1), puis relance le workflow. |
| L'`@import` ne semble pas appliqué | Vérifie qu'il est la **première ligne** du champ Custom CSS et que l'URL est correcte (casse du nom de dépôt). |
| Modifs pas visibles après un push | GitHub Pages peut prendre ~1 min. Fais un **hard refresh** (Ctrl+F5 / Cmd+Shift+R). Si le cache persiste, ajoute `?v=2` à la fin de l'URL dans l'`@import` (en dernier recours). |
| Pas de déploiement après push | Vérifie que la branche par défaut est `main` (sinon adapte `branches:` dans `.github/workflows/deploy-pages.yml`). |
| Test en local | `npm install` puis `npm run build` → résultat dans `dist/style.min.css`. |
