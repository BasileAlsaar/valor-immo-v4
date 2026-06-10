/**
 * Valeurs locatives commerciales — 20 arrondissements parisiens.
 *
 * Médianes pour emplacement 1bis / 2, **hors prime exclusif n°1**.
 * Mise à jour 2026-05-27 à partir de sources publiques 2024-2026.
 * Traçabilité complète, méthodologie et mapping détaillé :
 * `docs/sources/estimations-paris-2026.md`.
 *
 * Ratio restau/commerce uniforme ×1.20 (convention métier).
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
  { num: 1,  display: "Paris 1ᵉʳ",  center: [2.3360, 48.8607], loyerCommerceMoyen:  730, loyerRestauExtract: 1000 },
  { num: 2,  display: "Paris 2ᵉ",   center: [2.3417, 48.8679], loyerCommerceMoyen:  600, loyerRestauExtract:  820 },
  { num: 3,  display: "Paris 3ᵉ",   center: [2.3622, 48.8632], loyerCommerceMoyen:  550, loyerRestauExtract:  750 },
  { num: 4,  display: "Paris 4ᵉ",   center: [2.3573, 48.8546], loyerCommerceMoyen:  770, loyerRestauExtract: 1050 },
  { num: 5,  display: "Paris 5ᵉ",   center: [2.3494, 48.8443], loyerCommerceMoyen:  560, loyerRestauExtract:  760 },
  { num: 6,  display: "Paris 6ᵉ",   center: [2.3324, 48.8497], loyerCommerceMoyen:  850, loyerRestauExtract: 1150 },
  { num: 7,  display: "Paris 7ᵉ",   center: [2.3122, 48.8566], loyerCommerceMoyen:  580, loyerRestauExtract:  800 },
  { num: 8,  display: "Paris 8ᵉ",   center: [2.3134, 48.8722], loyerCommerceMoyen:  900, loyerRestauExtract: 1200 },
  { num: 9,  display: "Paris 9ᵉ",   center: [2.3375, 48.8769], loyerCommerceMoyen:  540, loyerRestauExtract:  740 },
  { num: 10, display: "Paris 10ᵉ",  center: [2.3608, 48.8761], loyerCommerceMoyen:  380, loyerRestauExtract:  550 },
  { num: 11, display: "Paris 11ᵉ",  center: [2.3795, 48.8593], loyerCommerceMoyen:  370, loyerRestauExtract:  500 },
  { num: 12, display: "Paris 12ᵉ",  center: [2.3879, 48.8404], loyerCommerceMoyen:  420, loyerRestauExtract:  550 },
  { num: 13, display: "Paris 13ᵉ",  center: [2.3624, 48.8322], loyerCommerceMoyen:  380, loyerRestauExtract:  480 },
  { num: 14, display: "Paris 14ᵉ",  center: [2.3266, 48.8331], loyerCommerceMoyen:  480, loyerRestauExtract:  650 },
  { num: 15, display: "Paris 15ᵉ",  center: [2.2980, 48.8417], loyerCommerceMoyen:  490, loyerRestauExtract:  650 },
  { num: 16, display: "Paris 16ᵉ",  center: [2.2620, 48.8606], loyerCommerceMoyen:  550, loyerRestauExtract:  770 },
  { num: 17, display: "Paris 17ᵉ",  center: [2.3066, 48.8869], loyerCommerceMoyen:  530, loyerRestauExtract:  760 },
  { num: 18, display: "Paris 18ᵉ",  center: [2.3486, 48.8927], loyerCommerceMoyen:  430, loyerRestauExtract:  600 },
  { num: 19, display: "Paris 19ᵉ",  center: [2.3812, 48.8869], loyerCommerceMoyen:  330, loyerRestauExtract:  450 },
  { num: 20, display: "Paris 20ᵉ",  center: [2.4006, 48.8635], loyerCommerceMoyen:  350, loyerRestauExtract:  480 },
]

export const ARGUS_DISCLAIMER =
  "Valeurs indicatives — moyenne pondérée sur emplacements 1bis et 2, hors prime exclusif (n°1). Pour une estimation personnalisée tenant compte de la qualité d'emplacement précise, contactez-nous."
