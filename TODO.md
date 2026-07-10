# TODO — BIKE&RUN

Feuille de route opérationnelle des prochaines étapes. Instantané au **10 juillet 2026**.
Priorité décroissante. Le détail SEO vit dans [`docs/seo-plan.md`](docs/seo-plan.md) ; ce fichier
est la vue d'ensemble et le journal des décisions à prendre.

Légende : `[ ]` à faire · `[~]` décision à acter · `[x]` fait.

---

## 0. Bloquant — mettre le site en ligne

- [ ] Activer GitHub Pages : *Settings → Pages → Source : **GitHub Actions*** (geste manuel, une seule fois).
  Sans ça, le déploiement échoue sur `Create Pages site failed` et rien n'est mesurable
  (Core Web Vitals, Search Console, aperçu de partage).

---

## 1. Hébergement & HTTPS — décision à acter

**État actuel** : GitHub Pages, servi en HTTPS automatique sur `mboix.github.io/bike-and-run/`.
Suffisant pour les démos, mais pas pour le référencement réel (sous-domaine partagé, chemin `/bike-and-run/`).

**Décision** : le **nom de domaine `bikeandrun.fr` est déjà réservé** ✅. Reste à choisir l'hébergement de production.
Le HTTPS n'est pas une tâche séparée : les trois options ci-dessous le fournissent gratuitement
(Let's Encrypt), y compris sur `bikeandrun.fr`.

| Option | Coût | HTTPS | Atouts | Limites |
|---|---|---|---|---|
| **GitHub Pages + domaine** | gratuit (hors domaine ~10 €/an) | auto | déjà en place, zéro migration, CI existante | pas de redirections/headers avancés |
| **Cloudflare Pages** | gratuit | auto | CDN rapide, headers/redirections, analytics intégrés | migration du déploiement |
| **Netlify** | gratuit | auto | formulaires, redirections, previews de PR | quotas sur l'offre gratuite |

**Recommandation** : rester sur **GitHub Pages + `bikeandrun.fr`** (aucune migration, on ajoute juste
un `CNAME` et la config DNS). Passer à Cloudflare Pages seulement si on a besoin de règles de redirection
ou de headers de sécurité fins.

- [x] Nom de domaine réservé : **`bikeandrun.fr`**.
- [~] Choisir l'hébergement de production (défaut proposé : GitHub Pages).
- [ ] Configurer le DNS de `bikeandrun.fr` vers l'hébergeur retenu.
- [ ] À la bascule : `CNAME`, redirections 301, et mise à jour de `canonical` / `sitemap.xml` / `robots.txt` vers `https://bikeandrun.fr/`.

---

## 2. SEO — le plus gros levier (plan écrit, implémentation à lancer)

Détail et critères d'acceptation dans [`docs/seo-plan.md`](docs/seo-plan.md). Rien n'est encore posé dans le `<head>`.

- [ ] JSON-LD `BikeStore` : adresse, horaires, **géoloc déjà relevée (48.8394, -0.8882)**, téléphone dès qu'il est connu.
- [ ] `meta description`, `canonical`, Open Graph + Twitter Card (image = la bannière).
- [ ] `robots.txt` + `sitemap.xml` (retirés volontairement au départ, à réintroduire).
- [ ] Vérifier l'indexation du catalogue rendu en JS ; au besoin, pré-générer une liste statique.
- [ ] Fiche Google Business Profile + stratégie d'avis (le nerf du pack local — voir plan, phase 5).

---

## 3. Performance & Core Web Vitals

- [ ] Images : convertir les 63 visuels en **WebP/AVIF**, générer `srcset`/`sizes` (formats aujourd'hui hétérogènes,
  certains PNG lourds). À faire dans une étape de l'Action de déploiement pour respecter « zéro build local ».
- [ ] Hero : `fetchpriority="high"` + WebP sur le badge (élément LCP probable).
- [ ] **Charger Leaflet à la demande** (144 Ko) quand la section « La boutique » entre dans le viewport.
- [ ] Sous-héberger un subset de **Poppins** (supprime une connexion tierce et le FOUT).
- [ ] Mesurer avec Lighthouse à chaque étape (cibles : Perf ≥ 90 mobile, LCP < 2,5 s, CLS < 0,1).

---

## 4. Analytics — décision à acter (le plus simple possible)

Besoin : mesurer les visites **sans complexité et sans bandeau RGPD**. Options sans cookies :

| Option | Coût | Bandeau cookies | Mise en œuvre |
|---|---|---|---|
| **Cloudflare Web Analytics** | gratuit | non requis | un script beacon, marche sur n'importe quel hébergeur |
| **GoatCounter** | gratuit (don pour usage commercial) | non requis | un script, tableau de bord minimal |
| **Plausible** | ~9 €/mois | non requis | un script, référence du marché |

**Recommandation** : **Cloudflare Web Analytics** — gratuit, sans cookie (donc pas de bandeau de consentement),
un seul script à coller, indépendant de l'hébergeur. Basculer vers Plausible plus tard si on veut plus de finesse.

- [~] Choisir l'outil (défaut proposé : Cloudflare Web Analytics).
- [ ] Intégrer le script et vérifier la remontée des visites.

---

## 5. Accessibilité

- [ ] Auditer la carte produit (bouton transparent en superposition `.product-card__ouvrir`) au lecteur d'écran et au clavier.
- [ ] Vérifier les contrastes du doré `#917C48` sur blanc (prix, catégories) vs WCAG AA.
- [ ] Accessibilité clavier de la carte Leaflet.
- [ ] Passage Lighthouse / axe une fois le site en ligne (cible A11y ≥ 95).

---

## 6. Migration Airtable (objectif de fond)

- [ ] Action GitHub planifiée : Airtable → `data/` au build, **clé API en secret GitHub** (jamais côté client).
- [ ] L'interface de `js/catalog.js` est déjà isolée : la bascule ne doit modifier aucun autre fichier.

---

## 7. Conformité & qualité

- [ ] **Mentions légales** (obligation France, même en vitrine) : éditeur, SIREN, hébergeur, directeur de publication.
- [ ] CI qualité : ajouter validation HTML + Lighthouse CI au pipeline pour éviter les régressions.
- [ ] Compléter les 6 produits sans photo (placeholder actuellement) et les champs « à compléter » de `data/boutique.json`
  (téléphone, e-mail, réseaux, parking, accessibilité PMR).

---

### Enchaînement conseillé

`0 activer Pages` → `2 SEO` → `3 images/Leaflet/polices` → `4 analytics`, en mesurant avec Lighthouse
entre chaque. Les décisions **1 (hébergement)** et **4 (analytics)** peuvent être actées à tout moment ;
elles conditionnent la mise en production réelle.
