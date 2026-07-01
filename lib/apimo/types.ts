/**
 * Types figés à partir des réponses réelles de l'API Apimo (provider 4852).
 *
 * - ApimoAgency  : validé sur GET /agencies (2026-06-15).
 * - ApimoProperty : surface consommée par le site figée sur les 8 fiches
 *   observées le 2026-07-01 (GET /agencies/26398/properties, total_items=8).
 *   Intersection avec Record<string, unknown> conservée pour laisser passer
 *   les 60+ champs Apimo non encore consommés (activities, documents, logs…).
 */

export type ApimoAgency = {
  id: string
  reference: string | null
  active: boolean
  name: string
  company: { id: string; name: string } | null
  brand: string | null
  networks: unknown[]
  address: string | null
  address_more: string | null
  city: { id: string; name: string; zipcode: string } | null
  district: string | null
  country: string
  region: string | null
  latitude: string | null
  longitude: string | null
  email: string | null
  phone: string | null
  fax: string | null
  url: string | null
  logo: string | null
  logo_svg: string | null
  pictures: string[]
  picture: string | null
  quality: number
  currency: string
  timetable: string | null
  created_at: string
  updated_at: string
  providers: string
  rates: unknown[]
  partners: unknown[]
  stories: { language: string; title: string; content: string }[]
  users: ApimoUser[]
  sectors: unknown[]
  parameters: string
  subscription: string
}

export type ApimoUser = {
  id: string
  agency: string
  active: boolean
  created_at: string
  updated_at: string
  firstname: string
  lastname: string
  username: string | null
  language: string
  spoken_languages: string[]
  group: string
  email: string | null
  phone: string | null
  mobile: string | null
  fax: string | null
  city: string | null
  birthday_at: string | null
  timezone: string | null
  picture: string | null
}

export type ApimoAgenciesResponse = {
  agencies: ApimoAgency[]
  total_items: number
  timestamp: number | null
}

export type ApimoPrice = {
  value: number | null
  max: number | null
  fees: number | null
  unit: number | null
  period: number | null
  hide: boolean
  inventory: number | null
  deposit: number | null
  currency: string
  commission: number | null
  transfer_tax: number | null
  contribution: number | null
  pension: number | null
  tenant: number | null
  vat: number | null
}

export type ApimoCity = {
  id: number
  name: string
  zipcode: string
}

export type ApimoPicture = {
  id: number
  type_id: number
  rank: number
  url: string
  width_max: number
  height_max: number
  internet: string
  print: string
  panorama: boolean
  child: string
  reference: string | null
  comments: unknown[]
}

export type ApimoComment = {
  language: string
  title: string | null
  subtitle: string | null
  hook: string | null
  comment: string | null
  comment_full: string | null
}

export type ApimoArea = {
  unit: number | null
  value: number | null
  total: number | null
  weighted: number | null
}

export type ApimoDistrict = {
  id: number
  name: string
}

export type ApimoProperty = Record<string, unknown> & {
  id: number
  reference: string
  status: number
  step: number
  group: number
  category: number
  subcategory: number | null
  type: number
  subtype: number | null
  price: ApimoPrice | null
  city: ApimoCity | null
  district: ApimoDistrict | null
  address: string | null
  address_more: string | null
  publish_address: boolean
  radius: number | null
  pictures: ApimoPicture[]
  medias: unknown[]
  comments: ApimoComment[]
  area: ApimoArea | null
  rooms: number | null
  bedrooms: number | null
  url: string | null
  latitude: string | number | null
  longitude: string | number | null
  created_at: string
  updated_at: string
}

export type ApimoPropertiesResponse = {
  properties: ApimoProperty[]
  total_items: number
  timestamp: number | null
  processing_time?: number
}
