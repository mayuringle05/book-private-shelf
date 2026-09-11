import fs from "node:fs";
import { loadEnvFile } from "node:process";
import pg from "pg";

if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
  loadEnvFile(".env");
}

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required. Create .env from .env.example or export DATABASE_URL before running database setup.",
  );
}

const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false;
const targetUrl = new URL(connectionString);
const databaseName = decodeURIComponent(targetUrl.pathname.replace(/^\//, ""));

if (!databaseName) {
  throw new Error("DATABASE_URL must include a database name.");
}

async function targetDatabaseExists() {
  const client = new Client({ connectionString, ssl });
  try {
    await client.connect();
    return true;
  } catch (error) {
    if (error?.code === "3D000") return false;
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

if (await targetDatabaseExists()) {
  console.log(`Database ${databaseName} already exists`);
  process.exit(0);
}

const adminUrl = new URL(connectionString);
adminUrl.pathname = "/postgres";
adminUrl.search = targetUrl.search;

const adminClient = new Client({ connectionString: adminUrl.toString(), ssl });
await adminClient.connect();

try {
  const { rows } = await adminClient.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [databaseName],
  );

  if (rows.length > 0) {
    console.log(`Database ${databaseName} already exists`);
  } else {
    const quotedDatabaseName = `"${databaseName.replaceAll('"', '""')}"`;
    await adminClient.query(`CREATE DATABASE ${quotedDatabaseName}`);
    console.log(`Created database ${databaseName}`);
  }
} finally {
  await adminClient.end();
}
