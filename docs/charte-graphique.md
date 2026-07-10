# Charte graphique BIKE&RUN

Charte dérivée des visuels officiels de l'enseigne : le logo et la bannière boutique (`assets/images/cover.jpg`).

Le **logo** existe en source vectorielle maîtresse `assets/brand/logo-bike-and-run.pdf` (Illustrator, fond transparent). Pour le web on sert un PNG transparent dérivé `assets/images/logo.png` (rendu à 640 px, léger pour les tailles d'affichage 42–320 px). Les favicons sont recadrés sur la pastille (roue) depuis cette même source. Le logo s'utilise **tel quel** — pas de recoloration, pas de retouche ; regénérer les dérivés depuis le PDF si besoin d'une autre taille.

## Palette

Couleurs extraites des visuels officiels (quantification des images sources).

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primaire | Noir charbon | `#1D1D1A` | Fonds sombres (header, footer, hero), textes sur fond clair |
| Accent | Doré bronze | `#917C48` | Boutons, liens, soulignés, pictogrammes, prix mis en avant |
| Accent clair | Laiton | `#B39A5F` | États hover/focus des éléments dorés |
| Fond clair | Blanc cassé | `#F7F4EE` | Fond général des sections claires |
| Neutre chaud | Bois clair | `#C7B099` | Bandeaux secondaires, séparateurs, rappel de la texture bois de la bannière |
| Neutre foncé | Bois brun | `#887B6B` | Textes secondaires sur fond clair, bordures |
| Blanc | Blanc pur | `#FFFFFF` | Cartes produits, textes sur fond sombre |

Règles :

- Le doré est un **accent**, jamais une couleur de fond de grande surface.
- Contraste : texte `#1D1D1A` sur `#F7F4EE`/blanc, texte blanc sur `#1D1D1A`. Ne pas écrire en doré sur bois clair (contraste insuffisant).
- La texture bois (visible sur la bannière) sert d'ambiance de fond de hero, avec un voile sombre si du texte est posé dessus.

## Typographie

L'identité visuelle mêle une sans-serif géométrique grasse (titres de la bannière) et une script brossée réservée au nom « Bike & Run » (portée par le logo, ne pas la reproduire en texte HTML).

- **Titres** : Poppins (600/700), en capitales pour les titres de sections — au plus proche de la bannière.
- **Texte courant** : Poppins (400) ou pile système `system-ui` en repli.
- Chargement via Google Fonts avec `font-display: swap` ; pas de webfont script — le lettrage « Bike & Run » n'existe que dans le logo image.

## Iconographie et imagerie

- Style badge/écusson vintage : formes circulaires, filets dorés, fonds charbon.
- Photos produits sur fond neutre clair ; ambiances chaleureuses (bois, atelier).
- Pictogrammes simples à trait, blancs ou dorés sur fond sombre.

## Composants (repères)

- **Bouton primaire** : fond `#917C48`, texte blanc, hover `#B39A5F`.
- **Bouton secondaire** : contour `#917C48`, texte `#1D1D1A` sur fond clair.
- **Carte produit** : fond blanc, ombre douce, catégorie en doré, prix en gras `#1D1D1A`.
- **Badge disponibilité** : `En stock` vert sobre `#3E7A4E`, `Sur commande` doré `#917C48`, `Rupture` gris `#887B6B`.

## Ton éditorial

Commerce de proximité normand : sobre, direct, chaleureux. Vouvoiement. Typographie française (espaces insécables avant `: ; ! ?`, apostrophes typographiques, prix `1 299,00 €`).
