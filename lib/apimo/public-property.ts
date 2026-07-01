/**
 * Mapper Apimo → objet public sérialisable pour le site.
 *
 * Discipline stricte :
 *  - on construit un NOUVEL objet, jamais de spread de l'objet Apimo ;
 *  - seuls les champs listés dans `PublicProperty` sont exposés ;
 *  - tous les autres champs Apimo (owner, user, tenant, private_comment,
 *    interagency_comment, status_comment, logs, referrals, created_by,
 *    updated_by, financial, exchanges, agreement, price.commission…) sont
 *    ignorés par construction, jamais mappés.
 *  - `publish_address` gouverne l'exposition de l'adresse rue.
 *  - latitude/longitude sont ARRONDIES à 3 décimales (≈ ±100 m) avant
 *    exposition. Les coords exactes ne franchissent jamais la frontière
 *    serveur → client (RGPD, discrétion propriétaire).
 *  - `content.comment` passe par un filet de redaction qui retire les
 *    numéros de mobile français (06/07, +33 6/7). Filet de sécurité ; le
 *    fix durable est de retirer les mobiles perso des descriptions côté
 *    CRM Apimo.
 */

import { labelFor } from "./catalogs"
import { computeSlug } from "./slug"
import type { ApimoProperty } from "./types"

// Rayon par défaut du cercle de zone (en mètres) si Apimo ne fournit pas
// `radius`. Choix : 400 m ≈ quartier piétonnier / grand îlot parisien.
const DEFAULT_ZONE_RADIUS_M = 400

// Mobile FR : 06/07 ou +33 6/+33 7, séparateurs espace, point ou tiret
// facultatifs entre les paires. Volontairement conservateur (pas de fixe
// 01-05, pas de 08/09) — objectif : masquer les numéros perso, pas les
// standards de l'agence.
const FRENCH_MOBILE_RE =
  /(?:\+33\s?|0)[67](?:[\s.\-]?\d{2}){4}\b/g

function redactFrenchMobile(text: string | null): string | null {
  if (!text) return text
  return text.replace(FRENCH_MOBILE_RE, "")
}

function roundCoord(v: string | number | null | undefined): number | null {
  if (v == null) return null
  const n = typeof v === "number" ? v : Number(v)
  if (!Number.isFinite(n)) return null
  // 3 décimales ≈ 111 m N-S, ~74 m E-W à la latitude de Paris.
  return Math.round(n * 1000) / 1000
}

export type PublicPrice = {
  value: number | null
  period: string // label fr via property_period
  currency: string
  fees: number | null
  deposit: number | null
}

export type PublicPicture = {
  url: string
  rank: number
  width_max: number
  height_max: number
}

export type PublicComment = {
  title: string | null
  subtitle: string | null
  hook: string | null
  comment: string | null
}

export type PublicArea = {
  total: number | null
  unit: number | null
}

export type PublicCity = {
  name: string
  zipcode: string
}

export type PublicDistrict = {
  name: string
}

export type PublicProperty = {
  id: number
  reference: string
  slug: string // kebab(title) + "-" + reference.toLowerCase()
  category: string // label
  type: string // label
  subtype: string // label
  city: PublicCity | null
  district: PublicDistrict | null
  address: string | null // rue, exposée uniquement si publish_address === true
  area: PublicArea
  rooms: number | null // omis (null) si 0
  bedrooms: number | null // omis (null) si 0
  price: PublicPrice | null
  pictures: PublicPicture[]
  content: PublicComment | null // commentaire fr uniquement
  latitude: number | null // arrondi 3 décimales (≈ ±100 m)
  longitude: number | null // arrondi 3 décimales (≈ ±100 m)
  zoneRadius: number // rayon en m pour dessiner un cercle de zone (défaut 400)
}

function positiveOrNull(v: number | null | undefined): number | null {
  return typeof v === "number" && v > 0 ? v : null
}

export function toPublicProperty(p: ApimoProperty): PublicProperty {
  const city: PublicCity | null = p.city
    ? { name: p.city.name, zipcode: p.city.zipcode }
    : null

  const district: PublicDistrict | null = p.district
    ? { name: p.district.name }
    : null

  const address: string | null = p.publish_address === true ? p.address : null

  const price: PublicPrice | null = p.price
    ? {
        value: p.price.value,
        period: labelFor("property_period", p.price.period),
        currency: p.price.currency,
        fees: p.price.fees,
        deposit: p.price.deposit,
      }
    : null

  // Tri par rank croissant → pictures[0] correspond toujours à la photo
  // « rank le plus bas » (photo de couverture Apimo).
  const pictures: PublicPicture[] = (p.pictures ?? [])
    .filter((pic) => pic.internet === "1")
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((pic) => ({
      url: pic.url,
      rank: pic.rank,
      width_max: pic.width_max,
      height_max: pic.height_max,
    }))

  const fr = (p.comments ?? []).find((c) => c.language === "fr")
  const content: PublicComment | null = fr
    ? {
        title: fr.title,
        subtitle: fr.subtitle,
        hook: fr.hook,
        comment: redactFrenchMobile(fr.comment),
      }
    : null

  const zoneRadius =
    typeof p.radius === "number" && p.radius > 0 ? p.radius : DEFAULT_ZONE_RADIUS_M

  const area: PublicArea = {
    total: p.area?.total ?? null,
    unit: p.area?.unit ?? null,
  }

  return {
    id: p.id,
    reference: p.reference,
    slug: computeSlug(fr?.title ?? null, p.reference),
    category: labelFor("property_category", p.category),
    type: labelFor("property_type", p.type),
    subtype: labelFor("property_subtype", p.subtype),
    city,
    district,
    address,
    area,
    rooms: positiveOrNull(p.rooms),
    bedrooms: positiveOrNull(p.bedrooms),
    price,
    pictures,
    content,
    latitude: roundCoord(p.latitude),
    longitude: roundCoord(p.longitude),
    zoneRadius,
  }
}
