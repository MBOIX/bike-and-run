# Plan d'implémentation SEO — BIKE&RUN

**Statut : plan validé, aucune action implémentée à ce jour.** Les phases seront mises en œuvre sur demande explicite ; aucune case ne se coche sans vérification du critère d'acceptation.

Objectif : **la première position Google sur les requêtes locales** (« magasin de vélo Vire », « réparation vélo Calvados », « VTT Vire Normandie », « magasin running Vire »…), pack local (carte Google) inclus. Le site étant une page unique statique, l'essentiel se joue sur la qualité technique, les données structurées et surtout le SEO local ancré sur l'adresse physique : **4 Rue du Cotin, 14500 Vire, France**. Cette adresse (NAP : nom, adresse, téléphone) doit être strictement identique, au caractère près, sur le site, la fiche Google et toutes les citations externes.

## Phase 1 — Socle technique

- [ ] `<title>` unique et descriptif (< 60 caractères, enseigne + activité + ville).
- [ ] `<meta name="description">` unique (< 160 caractères, incitant au clic).
- [ ] `<link rel="canonical">` vers l'URL de production (**`https://bikeandrun.fr/`**, domaine déjà réservé).
- [ ] HTML sémantique validé : un seul `<h1>`, hiérarchie `h2`/`h3` sans trou, balises `header/main/section/footer/address`.
- [ ] `robots.txt` autorisant l'indexation et pointant vers le sitemap (`https://bikeandrun.fr/sitemap.xml`).
- [ ] `sitemap.xml` (une URL `https://bikeandrun.fr/` pour l'instant, `lastmod` maintenu à chaque évolution notable).
- [ ] Page `404.html` personnalisée (GitHub Pages la sert automatiquement).
- [ ] Favicon et icônes (`favicon.ico`, `apple-touch-icon`) dérivés du logo.

**Critères d'acceptation** : audit Lighthouse SEO ≥ 95 ; aucune erreur dans la validation HTML (validator.w3.org).

## Phase 2 — Données structurées et partage social

- [ ] JSON-LD `BikeStore` (sous-type de `LocalBusiness`) : nom, adresse postale complète (`streetAddress` : 4 Rue du Cotin, `postalCode` : 14500, `addressLocality` : Vire, `addressCountry` : FR), **coordonnées GPS** (`geo` avec `latitude`/`longitude` relevées sur place ou via le cadastre), lien carte (`hasMap`), zone desservie (`areaServed` : Vire Normandie et bocage virois), horaires (`openingHoursSpecification`), image, URL, téléphone dès qu'il est connu.
- [ ] JSON-LD catalogue : `ItemList` des produits phares avec `Product` + `Offer` (prix TTC en EUR, disponibilité `InStock`/`PreOrder`/`OutOfStock`, `priceValidUntil` pour les soldes).
- [ ] Open Graph (`og:title`, `og:description`, `og:image` = bannière, `og:locale` = `fr_FR`) et Twitter Card (`summary_large_image`).
- [ ] Validation : Rich Results Test de Google et Sharing Debugger de Facebook.

**Critères d'acceptation** : zéro erreur au Rich Results Test ; aperçu de partage correct sur Facebook/WhatsApp.

## Phase 3 — Contenu et sémantique locale

- [ ] Contenu critique (présentation boutique, adresse, horaires, services) dans le **HTML statique**, jamais injecté en JavaScript. Seul le catalogue peut être rendu côté client (Google l'indexe, mais le contenu vital ne doit pas en dépendre).
- [ ] `<h1>` portant l'enseigne + l'activité + la ville (ex. « BIKE&RUN — magasin de vélo et running à Vire »).
- [ ] Sections avec `h2` reprenant les intentions de recherche : vélos (VTT, course, ville, électrique, enfant), atelier/réparation, running/trail, la boutique.
- [ ] Champ lexical local dans le corps de texte : Vire Normandie, Calvados, bocage virois — naturellement, sans bourrage de mots-clés.
- [ ] Attributs `alt` descriptifs sur toutes les images (produits inclus lorsqu'elles arriveront d'Airtable).
- [ ] Ancres internes propres (`#catalogue`, `#boutique`, `#contact`) reprises dans la navigation.

**Critères d'acceptation** : relecture wording (skill `wordings-fr`) ; la page sans JavaScript affiche toujours l'essentiel.

## Phase 4 — Performance et Core Web Vitals

- [ ] Images en WebP/AVIF avec repli, `width`/`height` posés (zéro CLS), `loading="lazy"` sous la ligne de flottaison, `fetchpriority="high"` sur l'image du hero.
- [ ] Polices : `preconnect`, `font-display: swap`, 2 graisses maximum ; envisager l'auto-hébergement.
- [ ] Aucun script bloquant (`type="module"` est différé par défaut) ; CSS minimal.
- [ ] Budget : page < 500 Ko transférés hors images produits, LCP < 2,5 s, CLS < 0,1.

**Critères d'acceptation** : Lighthouse Performance ≥ 90 sur mobile, les trois Core Web Vitals au vert.

## Phase 5 — SEO local et géolocalisation (le nerf de la guerre pour le top 1)

Sur une requête locale, Google classe d'abord le **pack local** (les trois fiches sur la carte) puis les résultats organiques. Viser le top 1 signifie gagner sur les deux tableaux : une fiche Google Business Profile irréprochable et un site qui la corrobore.

- [ ] Créer/revendiquer la fiche **Google Business Profile** (catégorie principale « Magasin de vélos », secondaires « Atelier de réparation de vélos », « Magasin d'articles de sport ») : adresse épinglée précisément au 4 Rue du Cotin, horaires, photos de la boutique et de l'atelier, description reprenant les mots-clés locaux.
- [ ] Relever les **coordonnées GPS exactes** de la boutique et les faire figurer dans le JSON-LD `geo` (phase 2) — cohérence stricte entre l'épingle Google Maps et le site.
- [ ] Afficher l'adresse complète sur le site en HTML (`<address>`), avec un lien « Itinéraire » vers Google Maps ; envisager une carte embarquée (en chargement différé pour ne pas dégrader la phase 4).
- [ ] **Stratégie d'avis clients** : solliciter systématiquement un avis Google après un achat ou une réparation (QR code en caisse), répondre à chaque avis — volume, fraîcheur et note des avis sont les premiers facteurs de classement du pack local.
- [ ] Publications régulières sur la fiche Google (nouveautés, soldes, événements) pour signaler une activité vivante.
- [ ] **Citations locales cohérentes** (NAP au caractère près) : PagesJaunes, mairie/office de tourisme de Vire Normandie, annuaires vélo/commerces de Normandie, Apple Business Connect, Bing Places.
- [ ] Lier le site depuis les pages Facebook et Instagram de la boutique, et réciproquement (liens dans le footer).
- [ ] **Backlinks locaux** : presse locale (Ouest-France, La Voix le Bocage), clubs cyclistes et de course à pied du bocage virois, sponsoring de courses locales avec lien vers le site.
- [ ] Bascule sur le **nom de domaine personnalisé `bikeandrun.fr`** (déjà réservé). Le sous-domaine `github.io` ne sert qu'aux démos ; le domaine propre est indispensable pour le référencement réel. À la mise en production : ajouter le `CNAME`, configurer le DNS, prévoir les redirections 301 depuis l'ancienne URL et mettre à jour `canonical` / `sitemap.xml` / `robots.txt` vers `https://bikeandrun.fr/`.

**Critères d'acceptation** : fiche Google validée et complète à 100 % ; NAP strictement identique partout ; premiers avis clients publiés ; le site apparaît dans le pack local sur « magasin de vélo Vire ».

## Phase 6 — Mesure et suivi

- [ ] Déclarer le site dans **Google Search Console** (et Bing Webmaster Tools), soumettre le sitemap.
- [ ] Vérifier l'indexation de la page et l'absence d'erreurs de couverture.
- [ ] Audit Lighthouse à chaque évolution majeure (cibles : SEO ≥ 95, Performance ≥ 90, Accessibilité ≥ 95).
- [ ] Revue trimestrielle : positions sur les requêtes locales cibles, mise à jour de `lastmod` dans le sitemap.

**Critères d'acceptation** : page indexée, sitemap traité sans erreur.

## Règles permanentes (une fois les phases lancées)

1. Tout contenu critique en HTML statique ; le JavaScript n'est qu'une amélioration.
2. Une seule `<h1>` ; hiérarchie de titres stricte ; `alt` sur toute image.
3. `title`, `meta description`, canonical, sitemap et JSON-LD maintenus à chaque évolution de la page.
4. Jamais de contenu dupliqué entre le site et les fiches externes : le site fait foi (source : `data/boutique.json`).
5. Chemins relatifs uniquement (le site vit sous `/bike-and-run/` sur GitHub Pages ; passera à la racine de `https://bikeandrun.fr/` à la bascule — les chemins relatifs fonctionnent dans les deux cas).
