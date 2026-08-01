/* Script de build : minifie src/style.css -> dist/style.min.css
   Utilisé par `npm run build` et par la GitHub Action. */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const csso = require('csso');

const root = path.join(__dirname, '..');
const srcFile = path.join(root, 'src', 'style.css');
const distDir = path.join(root, 'dist');
const outFile = path.join(distDir, 'style.min.css');

if (!fs.existsSync(srcFile)) {
  console.error(`Source CSS introuvable : ${srcFile}`);
  process.exit(1);
}

const source = fs.readFileSync(srcFile, 'utf8');

// Minifie le CSS (optimisation structurelle + suppression des commentaires)
const result = csso.minify(source, {
  restructure: true,
  comments: false,
});

fs.mkdirSync(distDir, { recursive: true });

// CSS minifié
fs.writeFileSync(outFile, result.css + '\n');

// .nojekyll : empêche GitHub Pages d'appliquer Jekyll (bonne pratique)
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// version.txt : aide à vérifier quelle version est déployée
let sha = 'local';
try {
  sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
} catch {
  /* pas un dépôt git local */
}
fs.writeFileSync(path.join(distDir, 'version.txt'), sha + '\n');

// _headers : pour Cloudflare Pages (recommandé) — force le navigateur à revalider
// style.min.css à chaque chargement (aucun cache de 10 min).
// GitHub Pages ignore ce fichier (servi tel quel, sans effet) → compatible.
fs.writeFileSync(
  path.join(distDir, '_headers'),
  '/*\n  Cache-Control: no-cache\n'
);

console.log('dist/style.min.css genere');
console.log('  Version : ' + sha);
console.log('  Taille  : ' + (result.css.length / 1024).toFixed(1) + ' Ko');
