import pg from "pg";
const { Pool } = pg;
declare global { var __privateShelfPool: pg.Pool | undefined; }
export function getPool() {
  if (global.__privateShelfPool) return global.__privateShelfPool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured. Start Postgres and run npm run db:setup.");
  const pool = new Pool({ connectionString, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false, max: 10, idleTimeoutMillis: 30_000 });
  if (process.env.NODE_ENV !== "production") global.__privateShelfPool = pool;
  return pool;
}
