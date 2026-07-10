# BIKE&RUN — Site vitrine

Landing page de présentation de la boutique **BIKE&RUN** — vélos (VTT, course, ville, électrique, enfant), casques et accessoires, running/trail — installée au 4 Rue du Cotin, 14500 Vire Normandie.

**Démo** : https://mboix.github.io/bike-and-run/

## Principes

- Site 100 % statique : HTML / CSS / JS vanilla, zéro dépendance, zéro build.
- Pas de panier ni de commande en ligne : une vitrine qui présente la boutique et son catalogue.
- Données produits mock dans `data/products.csv`, à terme synchronisées depuis Airtable (voir `CLAUDE.md`).

## Démarrer en local

```bash
git clone git@github.com:MBOIX/bike-and-run.git
cd bike-and-run
./dev.sh          # sert le site et ouvre http://localhost:8000 (autre port : ./dev.sh 3000)
```

⚠️ Ouvrir `index.html` en double-clic (`file://`) ne fonctionne pas : les navigateurs y bloquent
les modules ES et `fetch()` par sécurité. Le site doit être servi en HTTP, d'où `./dev.sh`.

## Tests

```bash
node --test
```

## Structure

```
├── index.html              # page unique du site
├── css/main.css            # styles (variables de charte dans :root)
├── js/
│   ├── catalog.js          # couche d'accès aux données (CSV/JSON, futur Airtable)
│   ├── catalog.test.js     # tests unitaires (node:test)
│   └── app.js              # rendu de la page
├── data/
│   ├── products.csv        # catalogue mock
│   └── boutique.json       # informations boutique
├── assets/images/          # logo et bannière officiels
├── docs/charte-graphique.md
└── .github/workflows/deploy.yml   # publication GitHub Pages
```

## Déploiement

Chaque push sur `main` publie le site sur GitHub Pages (réglage requis une fois : *Settings → Pages → Source : GitHub Actions*).

## Feuille de route

Les prochaines étapes détaillées (SEO, performance, hébergement `bikeandrun.fr` + HTTPS, analytics, Airtable)
sont consignées dans [`TODO.md`](TODO.md). En résumé :

1. ✅ Socle du projet : charte, données mock, déploiement Pages.
2. ✅ Landing page : hero, catalogue filtrable, fiche produit, carte, favicon.
3. ⏳ Mise en œuvre du plan SEO (`docs/seo-plan.md`) — plan rédigé, implémentation à déclencher.
4. ⏳ Mise en production sur `bikeandrun.fr` (domaine réservé).
5. ⏳ Synchronisation Airtable → `data/` via GitHub Actions planifiée.
