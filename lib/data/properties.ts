/**
 * Mock opportunités — 8 biens fictifs (figés Phase 4) pour le carrousel home,
 * les sous-pages classes-d-actifs et la page /opportunites (catalogue).
 *
 * Phase 7 : ajout du champ `categories: PropertyCategory[]` (tags multi-valeurs)
 * pour adresser le filtrage par slug de classes-d-actifs. `type` reste une
 * valeur physique unique pour l'affichage UI (badge du type d'actif).
 *
 * Photos en fallback fir-dark (brief V3 ligne 252). À remplacer par photos
 * réelles client (CONTENT_TODO.md Phase 12).
 *
 * Les chiffres sont en €/mois HT HC pour le loyer, et en € total pour le prix.
 */

export type PropertyStatut = "location" | "vente" | "murs-libres"

export type PropertyType =
  | "local-commercial"
  | "bureau"
  | "immeuble"
  | "hotellerie"
  | "logistique"
  | "fonds-commerce"

/** Slugs des 6 pages /classes-d-actifs/[slug]. Un bien peut appartenir à plusieurs. */
export type PropertyCategory =
  | "locaux-commerciaux"
  | "bureaux"
  | "hotellerie"
  | "immeubles"
  | "entrepots-logistique"
  | "cession-droit-au-bail"

export type Property = {
  slug: string
  ref: string
  statut: PropertyStatut
  type: PropertyType
  categories: PropertyCategory[]
  title: string
  quartier: string
  arrondissement: number
  /** Coordonnées approximatives [lng, lat] pour la carte catalogue */
  center: [number, number]
  surface: number
  surfaceSousSol?: number
  activiteAutorisee?: string
  tags?: string[]
  loyerMensuel?: number
  prix?: number
  honoraires?: string
  depotGarantie?: string
  bail?: string
  /** Liste de photos. Vide ou absent → fallback fir-dark dans la galerie */
  photos?: string[]
  description?: string
  caracteristiques?: { label: string; value: string }[]
}

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

export const properties: Property[] = [
  {
    slug: "local-chatelet-halles-173m2",
    ref: "MZ1-2026",
    statut: "location",
    type: "local-commercial",
    categories: ["locaux-commerciaux"],
    title: "Local commercial — Châtelet · Les Halles",
    quartier: "Châtelet · Les Halles",
    arrondissement: 1,
    center: [2.3470, 48.8606],
    surface: 173,
    activiteAutorisee: "Restauration avec extraction",
    tags: ["Restauration avec extraction", "Façade d'angle"],
    loyerMensuel: 7000,
    bail: "Bail 3/6/9",
    honoraires: "15 % du loyer annuel HT HC",
    depotGarantie: "3 mois de loyer",
    description:
      "Local commercial d'angle au cœur du quartier de Châtelet — Les Halles. Vitrine double exposition, RDC en pleine vue, hauteur sous plafond 3,5 m. Extraction en place, bail tous commerces hors nuisances. Pas-de-porte à négocier selon le candidat.",
    caracteristiques: [
      { label: "Surface RDC", value: "173 m²" },
      { label: "Linéaire vitrine", value: "8,5 m" },
      { label: "Activité autorisée", value: "Tous commerces avec extraction" },
      { label: "ERP", value: "Catégorie 5 type M" },
      { label: "DPE", value: "D" },
      { label: "GES", value: "C" },
      { label: "Disponibilité", value: "Immédiate" },
    ],
  },
  {
    slug: "bureaux-monceau-340m2",
    ref: "MZ2-2026",
    statut: "location",
    type: "bureau",
    categories: ["bureaux"],
    title: "Plateau de bureaux — Monceau",
    quartier: "Monceau",
    arrondissement: 8,
    center: [2.3081, 48.8804],
    surface: 340,
    tags: ["Plateau divisible", "Climatisation"],
    loyerMensuel: 19500,
    bail: "Bail tertiaire 3/6/9",
    honoraires: "15 % du loyer annuel HT HC",
    depotGarantie: "3 mois de loyer",
    description:
      "Plateau de bureaux Grade A, immeuble haussmannien rénové en 2022 — quartier Monceau. Climatisation réversible, fibre dédiée, GTB connecté. Divisible à partir de 180 m². Mesures incitatives à discuter (franchise + paliers).",
    caracteristiques: [
      { label: "Surface totale", value: "340 m²" },
      { label: "Divisibilité", value: "À partir de 180 m²" },
      { label: "Étage", value: "3ᵉ avec ascenseur" },
      { label: "Climatisation", value: "Réversible (Daikin VRV)" },
      { label: "Certifications", value: "BREEAM Very Good · BBC" },
      { label: "Disponibilité", value: "Mars 2026" },
    ],
  },
  {
    slug: "immeuble-grands-boulevards-840m2",
    ref: "MZ4-2026",
    statut: "vente",
    type: "immeuble",
    categories: ["immeubles"],
    title: "Immeuble mixte — Grands Boulevards",
    quartier: "Grands Boulevards",
    arrondissement: 9,
    center: [2.3464, 48.8716],
    surface: 840,
    tags: ["Mixte commerce/habitation", "Façade haussmannienne"],
    prix: 6800000,
    description:
      "Immeuble haussmannien R+5 sur les Grands Boulevards. Commerce en RDC (loué), 4 plateaux d'habitation aux étages (2 vacants, 2 loués). Façade ravalée en 2019. Ascenseur conforme. Idéal investisseur patrimonial ou marchand de biens.",
    caracteristiques: [
      { label: "Surface totale", value: "840 m²" },
      { label: "Niveau", value: "R+5 avec combles aménagés" },
      { label: "Lots", value: "1 commerce + 4 appartements" },
      { label: "Occupation", value: "3 lots loués / 2 vacants" },
      { label: "Rapport locatif brut", value: "215 000 €/an" },
      { label: "Façade", value: "Ravalée 2019" },
      { label: "Ascenseur", value: "Aux normes 2022" },
    ],
  },
  {
    slug: "boutique-passy-86m2",
    ref: "MZ5-2026",
    statut: "location",
    type: "local-commercial",
    categories: ["locaux-commerciaux"],
    title: "Boutique de luxe — Passy",
    quartier: "Passy",
    arrondissement: 16,
    center: [2.2769, 48.8579],
    surface: 86,
    tags: ["Vitrine 6 mètres", "Activité libre sauf restauration"],
    loyerMensuel: 4800,
    bail: "Bail tous commerces sauf restauration",
    honoraires: "15 % du loyer annuel HT HC",
    depotGarantie: "3 mois de loyer",
    description:
      "Boutique avec belle vitrine 6 mètres rue de Passy. Clientèle premium résidentielle 16e. Sol parquet pierre, hauteur 3,8 m. Idéal mode, beauté, bijouterie, optique. Pas de restauration au bail (limitation copropriété).",
    caracteristiques: [
      { label: "Surface", value: "86 m²" },
      { label: "Linéaire vitrine", value: "6 m" },
      { label: "Hauteur sous plafond", value: "3,8 m" },
      { label: "Activité autorisée", value: "Tous commerces sauf restauration" },
      { label: "Disponibilité", value: "Janvier 2026" },
    ],
  },
  {
    slug: "hotel-marais-12-chambres",
    ref: "MZ6-2026",
    statut: "murs-libres",
    type: "hotellerie",
    categories: ["hotellerie"],
    title: "Hôtel 3* murs libres — Le Marais",
    quartier: "Le Marais",
    arrondissement: 3,
    center: [2.3620, 48.8625],
    surface: 420,
    tags: ["12 chambres", "Restauration au rez-de-chaussée"],
    prix: 5400000,
    description:
      "Hôtel 3 étoiles murs libres en plein cœur du Marais. 12 chambres rénovées 2021, restaurant 30 couverts en RDC, ascenseur conforme PMR. Cession des murs sans le fonds (exploitation à confier à un opérateur). Murs nus disponibles immédiatement.",
    caracteristiques: [
      { label: "Surface totale", value: "420 m²" },
      { label: "Chambres", value: "12 (1 PMR)" },
      { label: "Classement", value: "3 étoiles" },
      { label: "Restaurant", value: "30 couverts au RDC" },
      { label: "Ascenseur", value: "Conforme PMR" },
      { label: "Rénovation", value: "2021 (chambres + parties communes)" },
    ],
  },
  {
    slug: "entrepot-pajol-680m2",
    ref: "MZ7-2026",
    statut: "location",
    type: "logistique",
    categories: ["entrepots-logistique"],
    title: "Entrepôt logistique urbaine — Pajol",
    quartier: "Pajol",
    arrondissement: 18,
    center: [2.3582, 48.8898],
    surface: 680,
    tags: ["Hauteur 5m sous plafond", "Quai de déchargement"],
    loyerMensuel: 9200,
    bail: "Bail tous commerces",
    description:
      "Entrepôt logistique urbaine 680 m² à proximité immédiate du périphérique nord. Quai de déchargement, hauteur libre 5 m, plancher 2,5 T/m². Bureaux attenants 60 m². Adapté messagerie dernière mile, dépôt local, atelier.",
    caracteristiques: [
      { label: "Surface entrepôt", value: "680 m²" },
      { label: "Bureaux attenants", value: "60 m²" },
      { label: "Hauteur libre", value: "5 m" },
      { label: "Plancher", value: "2,5 T/m²" },
      { label: "Quai", value: "1 quai de déchargement" },
      { label: "Disponibilité", value: "Immédiate" },
    ],
  },
]
