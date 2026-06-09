/**
 * Source de vérité — variables Valor Immo agence.
 * Aucune invention : si une donnée manque, voir CONTENT_TODO.md.
 */

export const SITE = {
  name: "Valor Immo",
  baseline: "Immobilier commercial et professionnel",
  domain: "valor-immo.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://valor-immo.com",
  telephoneDisplay: "07 67 86 34 61",
  telephoneTel: "+33767863461",
  email: "contact1valorimmo@gmail.com",
  address: {
    line1: "96 Rue Boileau",
    line2: "75016 Paris",
    arrondissement: "Paris 16ᵉ",
    postalCode: "75016",
    city: "Paris",
    country: "FR",
  },
  hours: {
    full: "Lun-Ven 09:00 – 19:00 · Sam : Fermé · Dim : Fermé",
    compact: "Lun-Ven 9h-19h",
    schedule: [
      { days: "Lun — Ven", time: "09h00 – 19h00" },
      { days: "Sam", time: "Fermé" },
      { days: "Dim", time: "Fermé" },
    ],
  },
  coords: {
    lng: 2.261717,
    lat: 48.839952,
  },
  hoguet: "Carte T en cours d'obtention — délivrée par la CCI Paris Île-de-France",
} as const

export const NAV = [
  { label: "Vente", href: "/vente" },
  { label: "Location", href: "/location" },
  { label: "Gestion", href: "/gestion" },
  { label: "Estimations", href: "/estimations" },
  { label: "Classes d'actifs", href: "/classes-d-actifs" },
  { label: "Opportunités", href: "/opportunites" },
  { label: "Actualités", href: "/actualites" },
  { label: "L'agence", href: "/l-agence" },
] as const
