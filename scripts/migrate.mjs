import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");
const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false;
const client = new Client({ connectionString: url, ssl });
await client.connect();
try {
  const dir = path.resolve("db/migrations");
  for (const file of fs.readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    console.log(`Applying ${file}`);
    await client.query(fs.readFileSync(path.join(dir, file), "utf8"));
  }
  console.log("Migrations complete");
} finally {
  await client.end();
}
