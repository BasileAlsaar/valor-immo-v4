/**
 * In-memory rate limiter — fenêtre glissante.
 * À remplacer par Upstash Ratelimit ou KV en prod multi-instance.
 */
const buckets = new Map<string, { count: number; reset: number }>()

export function rateLimit(
  key: string,
  { max = 5, windowMs = 60_000 } = {},
): { ok: boolean; remaining: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: max - 1 }
  }
  if (b.count >= max) return { ok: false, remaining: 0 }
  b.count += 1
  return { ok: true, remaining: max - b.count }
}
