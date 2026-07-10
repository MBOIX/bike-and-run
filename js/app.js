import { loadProducts, loadBoutique, formatPrice } from './catalog.js';

const FILTRE_TOUS = 'Tous';
const FILTRE_SOLDES = 'En solde';
const IMAGE_PAR_DEFAUT = 'assets/images/products/placeholder.svg';

const blocSelection = document.querySelector('#catalogue-bloc-selection');
const grilleSelection = document.querySelector('#catalogue-selection');
const grille = document.querySelector('#catalogue-grille');
const conteneurFiltres = document.querySelector('#catalogue-filtres');
const selecteurTri = document.querySelector('#catalogue-tri');
const statut = document.querySelector('#catalogue-statut');
const fiche = document.querySelector('#fiche-produit');

const etat = { products: [], filtre: FILTRE_TOUS, tri: 'selection' };

const TRIS = {
  selection: (a, b) =>
    Number(b.miseEnAvant) - Number(a.miseEnAvant)
    || Number(b.enSolde) - Number(a.enSolde)
    || Number(b.nouveaute) - Number(a.nouveaute),
  'prix-croissant': (a, b) => prixEffectif(a) - prixEffectif(b),
  'prix-decroissant': (a, b) => prixEffectif(b) - prixEffectif(a),
  nouveautes: (a, b) => Number(b.nouveaute) - Number(a.nouveaute),
};

function prixEffectif(product) {
  return product.prixSolde ?? product.prix;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function disponibiliteModifier(disponibilite) {
  if (disponibilite === 'En stock') return 'stock';
  if (disponibilite === 'Sur commande') return 'commande';
  return 'rupture';
}

function badgeDisponibilite(product) {
  return `<span class="disponibilite disponibilite--${disponibiliteModifier(product.disponibilite)}">${escapeHtml(product.disponibilite)}</span>`;
}

function blocPrix(product) {
  if (!product.enSolde) {
    return `<strong class="product-card__prix-courant">${formatPrice(product.prix)}</strong>`;
  }
  return `
    <s class="product-card__prix-barre">${formatPrice(product.prix)}</s>
    <strong class="product-card__prix-courant product-card__prix-courant--solde">${formatPrice(product.prixSolde)}</strong>
  `;
}

function drapeaux(product) {
  return [
    product.enSolde ? `<span class="product-card__flag product-card__flag--solde">−${product.tauxRemise} %</span>` : '',
    product.nouveaute ? '<span class="product-card__flag product-card__flag--nouveaute">Nouveauté</span>' : '',
    product.occasion ? '<span class="product-card__flag product-card__flag--occasion">Occasion</span>' : '',
  ].join('');
}

/* --------------------------------------------------------------------------
   Cartes du catalogue
   -------------------------------------------------------------------------- */

function carteProduit(product) {
  const visuel = product.images[0] ?? IMAGE_PAR_DEFAUT;
  const meta = [product.genre, product.tailles, product.anneeModele]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' · ');

  return `
    <article class="product-card${product.enSolde ? ' product-card--solde' : ''}">
      <div class="product-card__visuel">
        <img src="${escapeHtml(visuel)}" alt="${escapeHtml(`${product.marque} ${product.nom}`)}" loading="lazy" decoding="async" width="600" height="450">
        <div class="product-card__flags">${drapeaux(product)}</div>
        <span class="product-card__cta" aria-hidden="true">Voir la fiche</span>
      </div>
      <div class="product-card__corps">
        <p class="product-card__categorie">${escapeHtml(product.categorie)}</p>
        <h3 class="product-card__nom">${escapeHtml(product.marque)} <span>${escapeHtml(product.nom)}</span></h3>
        <p class="product-card__meta">${meta}</p>
      </div>
      <footer class="product-card__pied">
        <p class="product-card__prix">${blocPrix(product)}</p>
        ${badgeDisponibilite(product)}
      </footer>
      <button type="button" class="product-card__ouvrir" data-id="${escapeHtml(product.id)}"
        aria-label="Voir la fiche : ${escapeHtml(`${product.marque} ${product.nom}`)}"></button>
    </article>
  `;
}

function filtrer(products, filtre) {
  if (filtre === FILTRE_TOUS) return products;
  if (filtre === FILTRE_SOLDES) return products.filter((product) => product.enSolde);
  return products.filter((product) => product.categorie === filtre);
}

function afficherCatalogue() {
  const produits = [...filtrer(etat.products, etat.filtre)].sort(TRIS[etat.tri]);
  if (produits.length === 0) {
    grille.innerHTML = '<p class="catalogue__vide">Aucun produit dans cette sélection pour le moment — passez nous voir en boutique !</p>';
  } else {
    grille.innerHTML = produits.map(carteProduit).join('');
  }
  statut.textContent = produits.length === etat.products.length
    ? `${etat.products.length} produits au catalogue.`
    : `${produits.length} produit${produits.length > 1 ? 's' : ''} sur ${etat.products.length}.`;
}

function afficherSelection() {
  const misEnAvant = etat.products.filter((product) => product.miseEnAvant);
  if (misEnAvant.length === 0) {
    blocSelection.hidden = true;
    return;
  }
  grilleSelection.innerHTML = misEnAvant.map(carteProduit).join('');
}

function construireFiltres() {
  const categories = [...new Set(etat.products.map((product) => product.categorie))];
  const compte = (libelle) => filtrer(etat.products, libelle).length;

  conteneurFiltres.innerHTML = [FILTRE_TOUS, ...categories, FILTRE_SOLDES].map((libelle) => `
    <button type="button" class="filtre${libelle === FILTRE_SOLDES ? ' filtre--soldes' : ''}"
      data-filtre="${escapeHtml(libelle)}" aria-pressed="${libelle === etat.filtre}">
      ${escapeHtml(libelle)} <span class="filtre__compte">${compte(libelle)}</span>
    </button>
  `).join('');

  conteneurFiltres.addEventListener('click', (event) => {
    const bouton = event.target.closest('button[data-filtre]');
    if (!bouton) return;
    etat.filtre = bouton.dataset.filtre;
    for (const autre of conteneurFiltres.querySelectorAll('button[data-filtre]')) {
      autre.setAttribute('aria-pressed', String(autre === bouton));
    }
    afficherCatalogue();
  });
}

/* --------------------------------------------------------------------------
   Fiche produit (dialog natif : focus piégé, Échap pour fermer)
   -------------------------------------------------------------------------- */

function specifications(product) {
  const lignes = [
    ['Référence', product.id],
    ['Genre', product.genre],
    ['Tailles', product.tailles],
    ['Couleur', product.couleur],
    ['Année modèle', product.anneeModele],
    ['État', product.occasion ? 'Occasion révisée en atelier' : 'Neuf'],
  ].filter(([, valeur]) => Boolean(valeur));

  return lignes
    .map(([nom, valeur]) => `<dt>${escapeHtml(nom)}</dt><dd>${escapeHtml(valeur)}</dd>`)
    .join('');
}

function galerie(product) {
  const images = product.images.length > 0 ? product.images : [IMAGE_PAR_DEFAUT];
  const alt = escapeHtml(`${product.marque} ${product.nom}`);
  const vignettes = images.length < 2 ? '' : `
    <div class="fiche__vignettes" role="group" aria-label="Autres photos">
      ${images.map((source, index) => `
        <button type="button" class="fiche__vignette${index === 0 ? ' fiche__vignette--active' : ''}" data-image="${escapeHtml(source)}"
          aria-label="Photo ${index + 1} sur ${images.length}">
          <img src="${escapeHtml(source)}" alt="" loading="lazy">
        </button>
      `).join('')}
    </div>
  `;
  return `
    <div class="fiche__galerie">
      <img class="fiche__image" src="${escapeHtml(images[0])}" alt="${alt}" width="600" height="450">
      ${vignettes}
    </div>
  `;
}

function ouvrirFiche(product) {
  const lienFabricant = product.urlFabricant
    ? `<a class="bouton bouton--secondaire" href="${escapeHtml(product.urlFabricant)}" target="_blank" rel="noopener">Fiche fabricant</a>`
    : '';

  fiche.innerHTML = `
    <button type="button" class="fiche__fermer" data-fermer aria-label="Fermer la fiche">✕</button>
    <div class="fiche__grille">
      ${galerie(product)}
      <div class="fiche__infos">
        <p class="product-card__categorie">${escapeHtml(product.categorie)}</p>
        <h3 class="fiche__titre" id="fiche-titre">${escapeHtml(product.marque)} ${escapeHtml(product.nom)}</h3>
        <div class="fiche__drapeaux">${drapeaux(product)}</div>
        <p class="fiche__prix">${blocPrix(product)} ${badgeDisponibilite(product)}</p>
        <p class="fiche__description">${escapeHtml(product.description)}</p>
        <dl class="fiche__specs">${specifications(product)}</dl>
        <div class="fiche__actions">
          <a class="bouton bouton--primaire" href="#venir" data-fermer>Voir en boutique</a>
          ${lienFabricant}
        </div>
        <p class="fiche__reassurance">Prix TTC. Produit présenté en boutique — conseil personnalisé, essai
        et préparation par notre atelier au 4 Rue du Cotin, à Vire.</p>
      </div>
    </div>
  `;
  fiche.showModal();
}

function brancherFiche() {
  document.addEventListener('click', (event) => {
    const bouton = event.target.closest('.product-card__ouvrir');
    if (!bouton) return;
    const product = etat.products.find((candidat) => candidat.id === bouton.dataset.id);
    if (product) ouvrirFiche(product);
  });

  fiche.addEventListener('click', (event) => {
    if (event.target === fiche || event.target.closest('[data-fermer]')) {
      fiche.close();
      return;
    }
    const vignette = event.target.closest('.fiche__vignette');
    if (vignette) {
      fiche.querySelector('.fiche__image').src = vignette.dataset.image;
      for (const autre of fiche.querySelectorAll('.fiche__vignette')) {
        autre.classList.toggle('fiche__vignette--active', autre === vignette);
      }
    }
  });
}

/* --------------------------------------------------------------------------
   Carte de localisation (Leaflet + tuiles OpenStreetMap)
   -------------------------------------------------------------------------- */

function initialiserCarte(geolocalisation) {
  const element = document.querySelector('#carte-boutique');
  if (!element) return;
  if (typeof L === 'undefined' || !geolocalisation?.latitude || !geolocalisation?.longitude) {
    element.textContent = 'Carte indisponible — retrouvez-nous au 4 Rue du Cotin, 14500 Vire.';
    return;
  }
  const position = [geolocalisation.latitude, geolocalisation.longitude];
  const carte = L.map(element, { scrollWheelZoom: false }).setView(position, 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© les contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(carte);
  L.marker(position, { icon: creerIconeVelo() }).addTo(carte)
    .bindPopup('<strong>BIKE&RUN</strong><br>4 Rue du Cotin, 14500 Vire')
    .openPopup();
}

// Marqueur maison : un petit vélo dans une pastille, à la place de la goutte
// d'eau par défaut de Leaflet (qui dépendrait en plus d'une image du CDN).
function creerIconeVelo() {
  const velo = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <polyline points="12 19 12 15 9 12 14 8 16 11 19 11" />
      <circle cx="16" cy="5" r="1" />
    </svg>`;
  return L.divIcon({
    className: 'marqueur-velo',
    html: `<span class="marqueur-velo__badge">${velo}</span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

/* --------------------------------------------------------------------------
   Apparitions au défilement
   -------------------------------------------------------------------------- */

function activerApparitions() {
  const cibles = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const cible of cibles) cible.classList.add('reveal--visible');
    return;
  }
  // Seuil 0 : on révèle dès qu'un pixel entre dans le viewport. Un seuil non nul
  // ne se déclencherait jamais sur une section plus haute que l'écran (le
  // catalogue en 1 colonne sur mobile), qui resterait alors invisible.
  const observateur = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      if (entree.isIntersecting) {
        entree.target.classList.add('reveal--visible');
        observateur.unobserve(entree.target);
      }
    }
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  for (const cible of cibles) observateur.observe(cible);
}

/* --------------------------------------------------------------------------
   Initialisation
   -------------------------------------------------------------------------- */

async function initialiserCatalogue() {
  try {
    etat.products = await loadProducts();
    construireFiltres();
    afficherSelection();
    afficherCatalogue();
    selecteurTri.addEventListener('change', () => {
      etat.tri = selecteurTri.value;
      afficherCatalogue();
    });
    brancherFiche();
  } catch (error) {
    blocSelection.hidden = true;
    statut.textContent = 'Le catalogue est momentanément indisponible. Retrouvez tous nos produits en boutique, 4 Rue du Cotin à Vire.';
    console.error(error);
  }
}

async function initialiserBoutique() {
  try {
    const boutique = await loadBoutique();
    initialiserCarte(boutique.geolocalisation);
  } catch (error) {
    initialiserCarte(null);
    console.error(error);
  }
}

activerApparitions();
initialiserCatalogue();
initialiserBoutique();
