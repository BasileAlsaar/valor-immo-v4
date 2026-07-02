/**
 * Source de vérité — variables Valor Immo agence.
 * Aucune invention : si une donnée manque, voir CONTENT_TODO.md.
 */

// Casse de la marque : ne vit qu'ici. Toute occurrence destinée aux signaux
// SEO/marque (title, OG siteName, JSON-LD, manifest) doit dériver de NAME.
const NAME = "VALOR IMMO" as const

export const SITE = {
  name: NAME,
  baseline: "Immobilier commercial et professionnel",
  homeTitle: `${NAME} — Immobilier d'entreprise & commercial à Paris`,
  homeDescription:
    "Agence parisienne d'immobilier d'entreprise et commercial : transaction, location et gestion de bureaux, commerces, immeubles et locaux d'activité.",
  domain: "groupevalorimmo.fr",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://groupevalorimmo.fr",
  telephoneDisplay: "01 89 40 70 00",
  telephoneTel: "+33189407000",
  email: "contact@groupevalorimmo.fr",
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
  { label: "Estimations", href: "/estimations" },
  { label: "Opportunités", href: "/opportunites" },
  { label: "Actualités", href: "/actualites" },
  { label: "L'agence", href: "/l-agence" },
] as const
