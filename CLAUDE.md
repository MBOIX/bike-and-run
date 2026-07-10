# BIKE&RUN — Landing page vitrine

## Contexte métier

Site vitrine de la boutique **BIKE&RUN** (SIREN 934 870 668), magasin de vélos et de running installé au **4 Rue du Cotin, 14500 Vire Normandie** (Calvados). Horaires : du mardi au samedi, 10 h – 13 h et 14 h – 19 h.

Univers de la boutique : vélo électrique, vélo enfant, vélo de course, vélo de ville, VTT, réparation/atelier, running et trail.

Le site présente le catalogue de produits et la boutique. **Il n'y a ni panier, ni tunnel de commande, ni compte client** — c'est une vitrine, pas un e-commerce.

## Périmètre

**Inclus** : présentation de la boutique (adresse, horaires, services), catalogue de produits consultable (catégories, prix TTC, disponibilité), charte graphique de l'enseigne.

**Exclus** : paiement, panier, compte utilisateur, backend applicatif, framework front.

## Stack et contraintes techniques

- **HTML / CSS / JS vanilla uniquement.** Zéro framework, zéro dépendance npm, zéro étape de build.
- Exception unique : **Leaflet 1.9.4** (carte de localisation) chargé depuis le CDN unpkg avec empreintes SRI, tuiles OpenStreetMap. Toute nouvelle dépendance externe doit être validée explicitement.
- JavaScript en **modules ES natifs** (`<script type="module">`).
- Hébergement : **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`). Le site est servi sous `https://mboix.github.io/bike-and-run/` → **toujours utiliser des chemins relatifs** (`data/products.csv`, jamais `/data/products.csv`).
- Compatibilité : navigateurs récents (evergreen). Pas de transpilation.
- Le site doit rester fonctionnel et lisible sans JavaScript pour le contenu statique (présentation boutique) ; seul le catalogue dépend de JS.

## Données et Airtable

Les données vivent dans `data/` et sont consommées **exclusivement** via la couche d'accès `js/catalog.js` (jamais de `fetch` de données ailleurs dans le code) :

- `data/products.csv` — catalogue produits **mock** (colonnes : `id, categorie, marque, nom, description, genre, tailles, couleur, annee_modele, etat, prix_ttc_eur, prix_solde_eur, taux_remise_pct, disponibilite, nouveaute, mise_en_avant, url_fabricant, image`). Valeurs de `disponibilite` : `En stock`, `Sur commande`, `Rupture` ; `etat` : `Neuf` ou `Occasion` ; `mise_en_avant` marque les produits phares destinés à une future section « sélection du moment ».
- `data/boutique.json` — informations de présentation de la boutique (identité, baseline, adresse, géolocalisation à relever, horaires, services, marques distribuées, moyens de paiement, accès, contact).

Contenu du mock : il s'appuie principalement sur les **gammes moyennes et hautes SCOTT** (vélos, casques, chaussures running/trail), complétées par quelques autres marques (Lapierre, Cube, MET, Salomon, Hoka, accessoires).

**Mode solde** : un produit est soldé si `prix_solde_eur` est renseigné ; `taux_remise_pct` porte alors le pourcentage de remise. À l'affichage : prix de base barré, prix soldé mis en avant, badge `-XX %`. Les deux colonnes restent vides pour un produit non soldé.

**Cible Airtable** : à terme, le catalogue viendra d'une base Airtable. Architecture retenue : une GitHub Action planifiée synchronisera Airtable → fichier statique dans `data/` au moment du build. **Interdiction absolue d'appeler l'API Airtable depuis le navigateur** : le site est statique et public, toute clé API embarquée côté client serait exposée. La clé vivra uniquement dans les secrets GitHub Actions.

Grâce à `js/catalog.js`, le passage mock → Airtable ne devra modifier aucun autre fichier.

## Charte graphique

Voir `docs/charte-graphique.md`. Résumé : noir charbon `#1D1D1A`, doré bronze `#917C48`, blanc cassé `#F7F4EE`, tons bois `#C7B099`. Le logo (`assets/images/logo.jpg`) et la bannière (`assets/images/cover.jpg`) s'utilisent **tels quels**, sans retouche ni recoloration.

## SEO

Le référencement suit le plan `docs/seo-plan.md`. **Statut : plan rédigé, implémentation non démarrée — ne rien implémenter (robots.txt, sitemap, JSON-LD, Open Graph, canonical…) sans demande explicite.** En revanche, la qualité de base s'applique toujours : HTML sémantique, une seule `<h1>`, attributs `alt`, contenu critique en HTML statique.

## Contenu et wording

- Tout le contenu est en **français**, avec la typographie française (espace insécable avant `: ; ! ?`, apostrophe typographique, prix au format `1 299,00 €`).
- Les prix sont **TTC** et formatés via `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.
- Ton : sobre, chaleureux, commerce de proximité. Pas de jargon marketing creux.

## Conventions de code

- Nommage des fichiers en `kebab-case` ; variables et fonctions JS en `camelCase`, en français ou anglais mais **sans abréviations**.
- CSS : variables de la charte dans `:root` (`css/main.css`), nommage des classes en BEM (`.product-card__price`).
- Gestion d'erreurs explicite : un échec de chargement des données doit afficher un message à l'utilisateur, jamais une page vide silencieuse.

## Développement local et vérifications

```bash
./dev.sh                      # sert le site et ouvre http://localhost:8000 (autre port : ./dev.sh 3000)
node --test                   # tests unitaires (node:test, zéro dépendance)
```

Ne jamais ouvrir `index.html` en `file://` : les navigateurs y bloquent modules ES et `fetch()` — toujours passer par le serveur HTTP local.

Avant tout commit : lancer les tests, vérifier le rendu local, contrôler qu'aucun chemin absolu n'a été introduit.

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` qui publie la racine du repo sur GitHub Pages. Prérequis one-shot dans les réglages GitHub du repo : *Settings → Pages → Source : GitHub Actions*.
