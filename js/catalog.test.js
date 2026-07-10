import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, toProduct, formatPrice } from './catalog.js';

/** Neutralise les espaces insécables (fines ou non) produits par Intl selon la version d'ICU. */
function normalizeSpaces(text) {
  return text.replace(/[  ]/g, ' ');
}

test('parseCsv associe les colonnes de l’en-tête aux valeurs de chaque ligne', () => {
  const rows = parseCsv('a,b,c\n1,2,3\n4,5,6\n');

  assert.deepEqual(rows, [
    { a: '1', b: '2', c: '3' },
    { a: '4', b: '5', c: '6' },
  ]);
});

test('parseCsv préserve les virgules dans les champs entre guillemets', () => {
  const rows = parseCsv('nom,description\nSpark,"VTT tout-suspendu, 130 mm"\n');

  assert.equal(rows[0].description, 'VTT tout-suspendu, 130 mm');
});

test('parseCsv restitue les guillemets doublés comme guillemets simples', () => {
  const rows = parseCsv('nom\n"le ""Spark"""\n');

  assert.equal(rows[0].nom, 'le "Spark"');
});

test('parseCsv accepte les fins de ligne CRLF', () => {
  const rows = parseCsv('a,b\r\n1,2\r\n');

  assert.deepEqual(rows, [{ a: '1', b: '2' }]);
});

test('parseCsv ignore les lignes vides', () => {
  const rows = parseCsv('a,b\n1,2\n\n\n3,4\n');

  assert.equal(rows.length, 2);
});

test('parseCsv complète par des chaînes vides les colonnes absentes en fin de ligne', () => {
  const rows = parseCsv('a,b,c\n1,2\n');

  assert.deepEqual(rows, [{ a: '1', b: '2', c: '' }]);
});

test('parseCsv retourne un tableau vide pour un texte vide', () => {
  assert.deepEqual(parseCsv(''), []);
});

function ligneCsv(surcharges = {}) {
  return {
    id: 'BR-003',
    categorie: 'VTT',
    marque: 'Scott',
    nom: 'Scale 970',
    description: 'VTT semi-rigide.',
    genre: 'Mixte',
    tailles: 'S à XL',
    couleur: 'Gris anthracite',
    annee_modele: '2025',
    etat: 'Neuf',
    prix_ttc_eur: '1199.00',
    prix_solde_eur: '',
    taux_remise_pct: '',
    disponibilite: 'En stock',
    nouveaute: 'non',
    mise_en_avant: 'non',
    url_fabricant: '',
    images: '',
    ...surcharges,
  };
}

test('toProduct type les nombres et les booléens d’un produit standard', () => {
  const product = toProduct(ligneCsv());

  assert.equal(product.prix, 1199);
  assert.equal(product.prixSolde, null);
  assert.equal(product.tauxRemise, null);
  assert.equal(product.enSolde, false);
  assert.equal(product.nouveaute, false);
  assert.equal(product.occasion, false);
  assert.equal(product.miseEnAvant, false);
  assert.equal(product.urlFabricant, null);
  assert.deepEqual(product.images, []);
});

test('toProduct découpe la liste d’images séparées par des points-virgules', () => {
  const product = toProduct(ligneCsv({
    images: 'assets/images/products/BR-003-1.jpg;assets/images/products/BR-003-2.jpg',
  }));

  assert.deepEqual(product.images, [
    'assets/images/products/BR-003-1.jpg',
    'assets/images/products/BR-003-2.jpg',
  ]);
});

test('toProduct active le mode solde quand un prix soldé est renseigné', () => {
  const product = toProduct(ligneCsv({
    prix_ttc_eur: '3199.00',
    prix_solde_eur: '2559.00',
    taux_remise_pct: '20',
  }));

  assert.equal(product.enSolde, true);
  assert.equal(product.prixSolde, 2559);
  assert.equal(product.tauxRemise, 20);
});

test('toProduct repère les produits d’occasion et mis en avant', () => {
  const product = toProduct(ligneCsv({ etat: 'Occasion', mise_en_avant: 'oui' }));

  assert.equal(product.occasion, true);
  assert.equal(product.miseEnAvant, true);
});

test('formatPrice écrit les prix en euros à la française', () => {
  assert.equal(normalizeSpaces(formatPrice(2559)), '2 559,00 €');
  assert.equal(normalizeSpaces(formatPrice(7.9)), '7,90 €');
});
