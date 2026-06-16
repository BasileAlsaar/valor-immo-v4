import { apimoFetch } from "./client"
import type {
  ApimoAgenciesResponse,
  ApimoAgency,
  ApimoPropertiesResponse,
  ApimoProperty,
} from "./types"

export { apimoFetch, ApimoError } from "./client"
export type {
  ApimoAgency,
  ApimoAgenciesResponse,
  ApimoPropertiesResponse,
  ApimoProperty,
  ApimoUser,
} from "./types"

export const VALOR_IMMO_AGENCY_ID = "26398"

export async function listAgencies(): Promise<ApimoAgency[]> {
  const data = await apimoFetch<ApimoAgenciesResponse>("/agencies")
  return data.agencies
}

export type ListPropertiesParams = {
  agencyId?: string
  limit?: number
  offset?: number
}

export async function listProperties(
  params: ListPropertiesParams = {}
): Promise<ApimoPropertiesResponse> {
  const { agencyId = VALOR_IMMO_AGENCY_ID, limit, offset } = params
  return apimoFetch<ApimoPropertiesResponse>(
    `/agencies/${agencyId}/properties`,
    { query: { limit, offset } }
  )
}

export async function createLead(
  payload: Record<string, unknown>,
  agencyId: string = VALOR_IMMO_AGENCY_ID
): Promise<unknown> {
  return apimoFetch<unknown>(`/agencies/${agencyId}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}
