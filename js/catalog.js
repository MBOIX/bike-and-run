/**
 * Couche d'accès aux données du site.
 * Aujourd'hui : fichiers statiques mock (data/products.csv, data/boutique.json).
 * Demain : fichiers générés depuis Airtable au build — l'interface de ce module ne change pas.
 */

const PRODUCTS_URL = 'data/products.csv';
const BOUTIQUE_URL = 'data/boutique.json';

/**
 * Analyse un texte CSV (séparateur virgule, champs éventuellement entre guillemets,
 * guillemets doublés pour l'échappement, fins de ligne LF ou CRLF).
 * Retourne un objet par ligne, dont les clés viennent de la ligne d'en-tête.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') {
        index++;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const filledRows = rows.filter((values) => values.some((value) => value.trim() !== ''));
  if (filledRows.length === 0) {
    return [];
  }
  const [header, ...records] = filledRows;
  return records.map((values) =>
    Object.fromEntries(header.map((name, column) => [name, values[column] ?? '']))
  );
}

/** Convertit une ligne CSV brute en objet produit typé. */
export function toProduct(row) {
  const prixSolde = row.prix_solde_eur === '' ? null : Number(row.prix_solde_eur);
  const tauxRemise = row.taux_remise_pct === '' ? null : Number(row.taux_remise_pct);
  return {
    id: row.id,
    categorie: row.categorie,
    marque: row.marque,
    nom: row.nom,
    description: row.description,
    genre: row.genre,
    tailles: row.tailles,
    couleur: row.couleur,
    anneeModele: row.annee_modele,
    occasion: row.etat === 'Occasion',
    prix: Number(row.prix_ttc_eur),
    prixSolde,
    tauxRemise,
    enSolde: prixSolde !== null,
    disponibilite: row.disponibilite,
    nouveaute: row.nouveaute === 'oui',
    miseEnAvant: row.mise_en_avant === 'oui',
    urlFabricant: row.url_fabricant === '' ? null : row.url_fabricant,
    image: row.image === '' ? null : row.image,
  };
}

/** Formate un prix TTC en euros à la française (ex. « 1 299,00 € »). */
export function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

async function fetchOrThrow(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Chargement impossible de ${url} (HTTP ${response.status})`);
  }
  return response;
}

/** Charge le catalogue complet, typé et dans l'ordre du fichier source. */
export async function loadProducts() {
  const response = await fetchOrThrow(PRODUCTS_URL);
  const text = await response.text();
  return parseCsv(text).map(toProduct);
}

/** Charge les informations de présentation de la boutique. */
export async function loadBoutique() {
  const response = await fetchOrThrow(BOUTIQUE_URL);
  return response.json();
}
