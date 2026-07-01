/**
 * Types et libellés d'affichage utilisés par les cartes/fiches de biens.
 *
 * Ces valeurs sont éditoriales (choix de vocabulaire Valor Immo), pas des
 * données Apimo — elles vivent à part du mapper `toDisplayProperty` pour
 * que la présentation reste stable même si le flux Apimo évolue.
 */

export type PropertyStatut = "location" | "vente" | "murs-libres"

export type PropertyType =
  | "local-commercial"
  | "bureau"
  | "immeuble"
  | "hotellerie"
  | "logistique"
  | "fonds-commerce"

export type PropertyCategory =
  | "locaux-commerciaux"
  | "bureaux"
  | "hotellerie"
  | "immeubles"
  | "entrepots-logistique"
  | "cession-droit-au-bail"

export const STATUT_LABEL: Record<PropertyStatut, string> = {
  location: "À louer",
  vente: "À vendre",
  "murs-libres": "Murs libres",
}

export const TYPE_LABEL: Record<PropertyType, string> = {
  "local-commercial": "Local commercial",
  bureau: "Bureaux",
  immeuble: "Immeuble",
  hotellerie: "Hôtellerie",
  logistique: "Logistique",
  "fonds-commerce": "Fonds de commerce",
}

export const CATEGORY_LABEL: Record<PropertyCategory, string> = {
  "locaux-commerciaux": "Locaux commerciaux",
  bureaux: "Bureaux",
  hotellerie: "Hôtellerie",
  immeubles: "Immeubles",
  "entrepots-logistique": "Entrepôts & Logistique",
  "cession-droit-au-bail": "Cession de droit au bail",
}
