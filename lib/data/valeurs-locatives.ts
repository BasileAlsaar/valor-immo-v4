/**
 * Valeurs locatives commerciales — 20 arrondissements parisiens.
 * Source de vérité fournie par le client (Phase 4 fix). Copie LITTÉRALE,
 * aucune extrapolation. La mention « Valeurs indicatives — fourchettes
 * basses moyennes basées sur emplacements n°1bis / 2 » sous la carte
 * s'applique globalement, jamais à une entrée individuelle.
 *
 * Note : Paris 8 a un ratio restau/commerce = 1.10 (vs 1.20 sur les 19 autres
 * arrondissements). Anomalie intentionnelle (Champs-Élysées : commerces de
 * luxe avec premium déjà élevé). Copié tel quel.
 */

export type ValeurLocative = {
  num: number
  display: string
  /** [lng, lat] coordonnées approximatives du centre de l'arrondissement */
  center: [number, number]
  /** €/m²/an HT HC pour un local commercial nu */
  loyerCommerceMoyen: number
  /** €/m²/an HT HC pour de la restauration avec extraction */
  loyerRestauExtract: number
}

export const ARRONDISSEMENTS_PARIS: ValeurLocative[] = [
  { num: 1,  display: "Paris 1ᵉʳ",  center: [2.3360, 48.8607], loyerCommerceMoyen: 2400, loyerRestauExtract: 2880 },
  { num: 2,  display: "Paris 2ᵉ",   center: [2.3417, 48.8679], loyerCommerceMoyen: 1850, loyerRestauExtract: 2220 },
  { num: 3,  display: "Paris 3ᵉ",   center: [2.3622, 48.8632], loyerCommerceMoyen: 1600, loyerRestauExtract: 1920 },
  { num: 4,  display: "Paris 4ᵉ",   center: [2.3573, 48.8546], loyerCommerceMoyen: 1950, loyerRestauExtract: 2340 },
  { num: 5,  display: "Paris 5ᵉ",   center: [2.3494, 48.8443], loyerCommerceMoyen: 1200, loyerRestauExtract: 1440 },
  { num: 6,  display: "Paris 6ᵉ",   center: [2.3324, 48.8497], loyerCommerceMoyen: 2900, loyerRestauExtract: 3480 },
  { num: 7,  display: "Paris 7ᵉ",   center: [2.3122, 48.8566], loyerCommerceMoyen: 1450, loyerRestauExtract: 1740 },
  { num: 8,  display: "Paris 8ᵉ",   center: [2.3134, 48.8722], loyerCommerceMoyen: 6800, loyerRestauExtract: 7480 },
  { num: 9,  display: "Paris 9ᵉ",   center: [2.3375, 48.8769], loyerCommerceMoyen: 2100, loyerRestauExtract: 2520 },
  { num: 10, display: "Paris 10ᵉ",  center: [2.3608, 48.8761], loyerCommerceMoyen: 950,  loyerRestauExtract: 1140 },
  { num: 11, display: "Paris 11ᵉ",  center: [2.3795, 48.8593], loyerCommerceMoyen: 900,  loyerRestauExtract: 1080 },
  { num: 12, display: "Paris 12ᵉ",  center: [2.3879, 48.8404], loyerCommerceMoyen: 720,  loyerRestauExtract: 864  },
  { num: 13, display: "Paris 13ᵉ",  center: [2.3624, 48.8322], loyerCommerceMoyen: 680,  loyerRestauExtract: 816  },
  { num: 14, display: "Paris 14ᵉ",  center: [2.3266, 48.8331], loyerCommerceMoyen: 850,  loyerRestauExtract: 1020 },
  { num: 15, display: "Paris 15ᵉ",  center: [2.2980, 48.8417], loyerCommerceMoyen: 950,  loyerRestauExtract: 1140 },
  { num: 16, display: "Paris 16ᵉ",  center: [2.2620, 48.8606], loyerCommerceMoyen: 1350, loyerRestauExtract: 1620 },
  { num: 17, display: "Paris 17ᵉ",  center: [2.3066, 48.8869], loyerCommerceMoyen: 1180, loyerRestauExtract: 1416 },
  { num: 18, display: "Paris 18ᵉ",  center: [2.3486, 48.8927], loyerCommerceMoyen: 680,  loyerRestauExtract: 816  },
  { num: 19, display: "Paris 19ᵉ",  center: [2.3812, 48.8869], loyerCommerceMoyen: 580,  loyerRestauExtract: 696  },
  { num: 20, display: "Paris 20ᵉ",  center: [2.4006, 48.8635], loyerCommerceMoyen: 620,  loyerRestauExtract: 744  },
]

export const ARGUS_DISCLAIMER =
  "Valeurs indicatives — fourchettes basses moyennes basées sur emplacements n°1bis / 2. Estimation personnalisée disponible sur demande."
