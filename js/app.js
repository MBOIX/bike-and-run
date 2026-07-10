import { loadProducts, formatPrice } from './catalog.js';

const FILTRE_TOUS = 'Tous';
const FILTRE_SOLDES = 'En solde';

const grille = document.querySelector('#catalogue-grille');
const conteneurFiltres = document.querySelector('#catalogue-filtres');
const statut = document.querySelector('#catalogue-statut');

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

function blocPrix(product) {
  if (!product.enSolde) {
    return `<strong class="product-card__prix-courant">${formatPrice(product.prix)}</strong>`;
  }
  return `
    <s class="product-card__prix-barre">${formatPrice(product.prix)}</s>
    <strong class="product-card__prix-courant product-card__prix-courant--solde">${formatPrice(product.prixSolde)}</strong>
  `;
}

function carteProduit(product) {
  const flags = [
    product.enSolde ? `<span class="product-card__flag product-card__flag--solde">−${product.tauxRemise} %</span>` : '',
    product.nouveaute ? '<span class="product-card__flag product-card__flag--nouveaute">Nouveauté</span>' : '',
    product.occasion ? '<span class="product-card__flag product-card__flag--occasion">Occasion</span>' : '',
  ].join('');

  const meta = [product.genre, product.tailles, product.couleur, product.anneeModele]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' · ');

  return `
    <article class="product-card${product.enSolde ? ' product-card--solde' : ''}">
      <div class="product-card__flags">${flags}</div>
      <p class="product-card__categorie">${escapeHtml(product.categorie)}</p>
      <h3 class="product-card__nom">${escapeHtml(product.marque)} <span>${escapeHtml(product.nom)}</span></h3>
      <p class="product-card__meta">${meta}</p>
      <p class="product-card__description">${escapeHtml(product.description)}</p>
      <footer class="product-card__pied">
        <p class="product-card__prix">${blocPrix(product)}</p>
        <span class="disponibilite disponibilite--${disponibiliteModifier(product.disponibilite)}">${escapeHtml(product.disponibilite)}</span>
      </footer>
    </article>
  `;
}

function filtrer(products, filtre) {
  if (filtre === FILTRE_TOUS) return products;
  if (filtre === FILTRE_SOLDES) return products.filter((product) => product.enSolde);
  return products.filter((product) => product.categorie === filtre);
}

function afficher(products, total) {
  grille.innerHTML = products.map(carteProduit).join('');
  statut.textContent = products.length === total
    ? `${total} produits au catalogue.`
    : `${products.length} produit${products.length > 1 ? 's' : ''} sur ${total}.`;
}

function construireFiltres(products) {
  const categories = [...new Set(products.map((product) => product.categorie))];
  const libelles = [FILTRE_TOUS, ...categories, FILTRE_SOLDES];

  conteneurFiltres.innerHTML = libelles.map((libelle) => `
    <button type="button" class="filtre${libelle === FILTRE_SOLDES ? ' filtre--soldes' : ''}"
      data-filtre="${escapeHtml(libelle)}" aria-pressed="${libelle === FILTRE_TOUS}">
      ${escapeHtml(libelle)}
    </button>
  `).join('');

  conteneurFiltres.addEventListener('click', (event) => {
    const bouton = event.target.closest('button[data-filtre]');
    if (!bouton) return;
    for (const autre of conteneurFiltres.querySelectorAll('button[data-filtre]')) {
      autre.setAttribute('aria-pressed', String(autre === bouton));
    }
    afficher(filtrer(products, bouton.dataset.filtre), products.length);
  });
}

function activerApparitions() {
  const cibles = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const cible of cibles) cible.classList.add('reveal--visible');
    return;
  }
  const observateur = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      if (entree.isIntersecting) {
        entree.target.classList.add('reveal--visible');
        observateur.unobserve(entree.target);
      }
    }
  }, { threshold: 0.15 });
  for (const cible of cibles) observateur.observe(cible);
}

async function initialiserCatalogue() {
  try {
    const products = await loadProducts();
    construireFiltres(products);
    afficher(products, products.length);
  } catch (error) {
    statut.textContent = 'Le catalogue est momentanément indisponible. Retrouvez tous nos produits en boutique, 4 Rue du Cotin à Vire.';
    console.error(error);
  }
}

activerApparitions();
initialiserCatalogue();
