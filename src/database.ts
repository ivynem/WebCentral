import { Pool } from "pg";

let pool: Pool | undefined;

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  pool ??= new Pool({
    connectionString,
    max: 2,
    connectionTimeoutMillis: 5_000,
    query_timeout: 5_000,
    idleTimeoutMillis: 10_000,
  });

  return pool;
}

export async function checkDatabaseConnection(): Promise<void> {
  await getPool().query("SELECT 1");
}
