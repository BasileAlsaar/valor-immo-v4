/**
 * Types figés à partir des réponses réelles de l'API Apimo (provider 4852).
 *
 * - ApimoAgency : validé sur GET /agencies (2026-06-15).
 * - ApimoProperty : laissé délibérément lâche tant qu'aucune annonce n'est
 *   publiée côté agence. Inspecter /tmp/apimo-properties-sample.json après
 *   la première mise en ligne pour figer le schéma exact.
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

export type ApimoProperty = Record<string, unknown> & {
  id?: string | number
  reference?: string
}

export type ApimoPropertiesResponse = {
  properties: ApimoProperty[]
  total_items: number
  timestamp: number | null
  processing_time?: number
}
