/**
 * Catalogs Apimo figés en TypeScript (culture=fr, snapshot du 2026-07-01).
 *
 * Source : GET https://api.apimo.pro/catalogs/{catalog}?culture=fr
 *   → /tmp/apimo-catalog-*.json au moment du snapshot.
 *
 * Rafraîchir manuellement si Apimo introduit de nouveaux ids : la fonction
 * `labelFor` loggue les ids inconnus pour faciliter la détection.
 *
 * Absent : property_group — l'endpoint /catalogs/property_group renvoie 404.
 * Le champ `group` sur une propriété reste donc non traduit côté public.
 */

export const property_category: Readonly<Record<number, string>> = {
  1: "Vente",
  2: "Location",
  3: "Location saisonnière",
  4: "Programme",
  5: "Viager",
  6: "Enchère",
} as const

export const property_type: Readonly<Record<number, string>> = {
  1: "Appartement",
  2: "Maison",
  3: "Terrain",
  4: "Commerce",
  5: "Garage / Parking",
  6: "Immeuble",
  7: "Bureau",
  8: "Bateau",
  9: "Locaux d'activité / Entrepôts",
  10: "Cave / Box",
} as const

export const property_subtype: Readonly<Record<number, string>> = {
  1: "Triplex",
  2: "Terrain constructible",
  3: "Terrain inconstructible",
  4: "Penthouse",
  5: "Appartement",
  6: "Studio",
  7: "Château",
  8: "Commerce",
  9: "Duplex",
  10: "Manoir",
  11: "Ferme",
  12: "Loft",
  13: "Maison de village",
  14: "Villa",
  15: "Appartement villa",
  16: "Grange",
  17: "Ruine",
  18: "Maison",
  19: "Propriété",
  20: "Ensemble immobilier",
  21: "Moulin",
  22: "Garage",
  23: "Fermette",
  24: "Immeuble",
  25: "Maison de ville",
  26: "Mobile home",
  27: "Chaumière",
  28: "Chambre",
  29: "Hangar",
  30: "Mas",
  31: "Local",
  32: "Chalet",
  33: "Local commercial",
  34: "Fonds de commerce",
  35: "Droit au bail",
  36: "Bureau",
  37: "Hôtel particulier",
  38: "Gérance",
  39: "Exploitation agricole",
  40: "Cave",
  41: "Entrepôt",
  42: "Remise",
  43: "Parking",
  44: "Hôtel",
  45: "Haras",
  46: "Terrain",
  47: "Bastide",
  48: "Bastidon",
  49: "Entreprise",
  50: "Propriété viticole",
  51: "Yacht",
  52: "Péniche",
  53: "Voilier",
  54: "Catamaran",
  55: "Domaine équestre",
  56: "Maison d'hôtes",
  57: "Gîte",
  58: "Riad",
  59: "Box",
  60: "Attique",
  61: "Arcade",
  62: "Boutique",
  63: "Atelier",
  64: "Shophouse",
  65: "Borey",
  66: "Condo",
  67: "Usine",
  68: "Appart'hôtel",
  69: "Villa jumelée",
  70: "Maison de plain-pied",
  71: "Maison jumelée",
  72: "Bungalow",
  73: "Maison de plage",
  74: "Place de port",
  77: "Île privée",
  78: "Terrain résidentiel",
  79: "Terrain commercial",
  80: "Lotissement",
  81: "Domaine de chasse",
  82: "Bateau à moteur",
  83: "Pavillon",
  84: "Ranch",
  85: "Lac",
  87: "Atelier artisanal",
  88: "Pavillon",
  89: "Cellier",
  90: "Grenier",
  96: "Masseria",
  97: "Nuraghe",
  98: "Palais",
  100: "Trullo",
  101: "Maison plurifamiliale",
  102: "Terratetto",
  103: "Terrain agricole",
  104: "Local et fonds de commerce",
  105: "Batiment historique",
  110: "Maisonette",
  111: "Dépendance",
  112: "Refuge",
  113: "Appartement type maison",
  114: "Appartement de plain-pied",
  115: "Cabinet",
  116: "Maison préfabriquée",
  117: "Lamia",
} as const

export const property_status: Readonly<Record<number, string>> = {
  1: "En cours",
  20: "Attente mandat",
  21: "Mandat expiré",
  22: "Sous offre / réservation",
  24: "Sous contrat vente/location",
  25: "Attente acte/bail",
  27: "Attente correction",
  28: "Attente validation",
  29: "Autre",
  30: "Vendu/loué par l'agence",
  31: "Vendu/loué par le propriétaire",
  32: "Vendu/loué par un confrère",
  33: "Retiré par l'agence",
  34: "Retiré par le propriétaire",
  35: "Vente/location annulée",
  39: "Autre",
  40: "Détruire cette fiche",
} as const

export const property_step: Readonly<Record<number, string>> = {
  1: "En cours",
  2: "En attente",
  3: "Terminé",
  4: "Supprimé",
} as const

export const property_period: Readonly<Record<number, string>> = {
  1: "Jour",
  2: "Semaine",
  3: "Quinzaine",
  4: "Mois",
  5: "Trimestre",
  6: "Bimensuel",
  7: "Semestre",
  8: "An",
} as const

export type CatalogName =
  | "property_category"
  | "property_type"
  | "property_subtype"
  | "property_status"
  | "property_step"
  | "property_period"

const CATALOGS: Readonly<Record<CatalogName, Readonly<Record<number, string>>>> = {
  property_category,
  property_type,
  property_subtype,
  property_status,
  property_step,
  property_period,
}

export const UNKNOWN_LABEL = "—"

/**
 * Retourne le libellé fr d'un id Apimo. id absent → UNKNOWN_LABEL, sans log.
 * id inconnu du catalog → UNKNOWN_LABEL + log warn (catalog probablement à
 * rafraîchir).
 */
export function labelFor(
  catalog: CatalogName,
  id: number | null | undefined
): string {
  if (id == null) return UNKNOWN_LABEL
  const label = CATALOGS[catalog][id]
  if (label === undefined) {
    console.warn(
      JSON.stringify({
        event: "apimo.catalog.unknown_id",
        catalog,
        id,
      })
    )
    return UNKNOWN_LABEL
  }
  return label
}
