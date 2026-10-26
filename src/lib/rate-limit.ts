export interface RateLimitResult { allowed: boolean; remaining: number; }

/** Optional Upstash-compatible limiter. Local development fails open when env is absent. */
export async function rateLimit(key: string, limit = 10, windowSeconds = 60): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { allowed: true, remaining: limit };
  const bucket = `atlas:rate:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
  const response = await fetch(`${url}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify([["INCR", bucket], ["EXPIRE", bucket, windowSeconds]]) });
  if (!response.ok) return { allowed: true, remaining: limit };
  const payload = (await response.json()) as Array<{ result: number }>;
  const count = Number(payload[0]?.result ?? 1);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
