import { Pool } from "pg"

const rawConnectionString =
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

if (!rawConnectionString) {
  throw new Error("Missing NEON_DATABASE_URL or DATABASE_URL environment variable")
}

const connectionString = rawConnectionString.includes("sslmode=")
  ? rawConnectionString.replace(/sslmode=[^&]+/, "sslmode=verify-full")
  : `${rawConnectionString}${rawConnectionString.includes("?") ? "&" : "?"}sslmode=verify-full`

const globalForPool = globalThis as unknown as { pgPool?: Pool }

export const pool =
  globalForPool.pgPool ??
  new Pool({
    connectionString,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPool.pgPool = pool
}

export async function query<T>(text: string, params: Array<string | number> = []) {
  const result = await pool.query<T>(text, params)
  return result.rows
}
