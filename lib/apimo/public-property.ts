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
 */

import { labelFor } from "./catalogs"
import type { ApimoProperty } from "./types"

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
  latitude: number | null
  longitude: number | null
}

function parseCoord(v: string | number | null | undefined): number | null {
  if (v == null) return null
  const n = typeof v === "number" ? v : Number(v)
  return Number.isFinite(n) ? n : null
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
        comment: fr.comment,
      }
    : null

  const area: PublicArea = {
    total: p.area?.total ?? null,
    unit: p.area?.unit ?? null,
  }

  return {
    id: p.id,
    reference: p.reference,
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
    latitude: parseCoord(p.latitude),
    longitude: parseCoord(p.longitude),
  }
}
