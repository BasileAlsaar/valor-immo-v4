// Node-only : Buffer + token serveur. À n'importer que côté serveur
// (Server Components, Route Handlers, Server Actions).

const BASE_URL = "https://api.apimo.pro"

function getAuthHeader(): string {
  const provider = process.env.APIMO_PROVIDER
  const token = process.env.APIMO_TOKEN
  if (!provider || !token) {
    throw new Error(
      "APIMO_PROVIDER et APIMO_TOKEN doivent être définis (cf. .env.local.example)."
    )
  }
  return "Basic " + Buffer.from(`${provider}:${token}`).toString("base64")
}

export type ApimoFetchInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>
  query?: Record<string, string | number | undefined>
}

export async function apimoFetch<T>(
  path: string,
  init: ApimoFetchInit = {}
): Promise<T> {
  const { query, headers, ...rest } = init
  const search = new URLSearchParams()
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) search.set(key, String(value))
    }
  }
  const qs = search.toString() ? `?${search.toString()}` : ""
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}${qs}`

  const res = await fetch(url, {
    ...rest,
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
      ...headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new ApimoError(res.status, path, body)
  }

  return (await res.json()) as T
}

export class ApimoError extends Error {
  readonly status: number
  readonly path: string
  readonly body: string
  constructor(status: number, path: string, body: string) {
    super(`Apimo ${status} on ${path}: ${body.slice(0, 200)}`)
    this.name = "ApimoError"
    this.status = status
    this.path = path
    this.body = body
  }
}
